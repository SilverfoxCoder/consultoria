import React, { useState, useEffect } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { analyticsService } from '../../services/analyticsService';
import budgetService from '../../services/budgetService';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../contexts/AuthContext';

const ClientAnalytics = () => {
  const { t } = useTranslations();
  const { user, clientId } = useAuth();

  // Estados para datos
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [kpis, setKpis] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [projectPerformance, setProjectPerformance] = useState([]);
  const [serviceBreakdown, setServiceBreakdown] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Cargar datos al montar el componente
  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      if (!isMounted) return;
      setIsLoading(true);

      try {
        const finalClientId = clientId || user?.id || 1;
        const data = await analyticsService.getDashboardAnalytics(finalClientId);

        if (data) {
          console.log('✅ Datos de analíticas recibidos:', data);

          const kpisData = [
            {
              name: t('client.totalSpent'),
              value: `€${(data.totalSpent || 0).toLocaleString()}`,
              change: '+0%',
              changeType: 'neutral',
              icon: CurrencyDollarIcon,
              color: 'text-green-400',
              bgColor: 'bg-green-400/10'
            },
            {
              name: t('client.activeProjects'),
              value: (data.activeProjects || 0).toString(),
              change: '0',
              changeType: 'neutral',
              icon: CheckCircleIcon,
              color: 'text-blue-400',
              bgColor: 'bg-blue-400/10'
            },
            {
              name: t('client.avgResponseTime'),
              value: '2.3h',
              change: '0',
              changeType: 'neutral',
              icon: ClockIcon,
              color: 'text-yellow-400',
              bgColor: 'bg-yellow-400/10'
            },
            {
              name: t('client.openTickets'),
              value: (data.openTickets || 0).toString(),
              change: '0',
              changeType: 'neutral',
              icon: ExclamationTriangleIcon,
              color: 'text-red-400',
              bgColor: 'bg-red-400/10'
            }
          ];

          setKpis(kpisData);
          setMonthlyData(data.monthlySpending || []);
          setServiceBreakdown(data.serviceBreakdown || []);
          setRecentActivity(data.recentActivity || []);

          // Project performance needs to come from projects list still? 
          // Actually let's fetch projects separately to keep that detailed view or simplify it.
          // For now, let's keep it separate or we can add it to DTO if needed.
          // Re-fetching projects here to keep the detailed list functionality 
          // or we can just mock it empty if we want to rely solely on the dashboard endpoint.
          // But the dashboard endpoint returned activeProjects count, not the list.
          // Let's fetch projects briefly to populate the list view.
          try {
            const projects = await projectService.getProjectsByClient(finalClientId);
            const projectsData = Array.isArray(projects) ? projects : [];
            setProjectPerformance(projectsData.map(p => ({
              name: p.name || p.title,
              progress: p.progress || 0,
              budget: p.budget || 0,
              spent: p.spent || 0,
              status: p.progress >= 100 ? 'completed' : p.status === 'delayed' ? 'delayed' : 'on-track'
            })));
          } catch (e) {
            console.warn('Could not load project details for list', e);
            setProjectPerformance([]);
          }

        } else {
          setKpis([]);
          setMonthlyData([]);
          setProjectPerformance([]);
          setServiceBreakdown([]);
          setRecentActivity([]);
        }
      } catch (error) {
        console.error('❌ Error al cargar datos del dashboard:', error);
        setKpis([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, [clientId, user, t]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'project':
        return CheckCircleIcon;
      case 'ticket':
        return ExclamationTriangleIcon;
      case 'budget':
        return CurrencyDollarIcon;
      case 'service':
        return ChartBarIcon;
      default:
        return CalendarIcon;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'project':
        return 'text-blue-400 bg-blue-400/10';
      case 'ticket':
        return 'text-orange-400 bg-orange-400/10';
      case 'budget':
        return 'text-green-400 bg-green-400/10';
      case 'service':
        return 'text-purple-400 bg-purple-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {t('client.analytics')}
            </h1>
            <p className="text-gray-400">
              {t('client.analyticsSubtitle')}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="week">{t('client.lastWeek')}</option>
              <option value="month">{t('client.lastMonth')}</option>
              <option value="quarter">{t('client.lastQuarter')}</option>
              <option value="year">{t('client.lastYear')}</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              {t('client.exportReport')}
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.name} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{kpi.name}</p>
                <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
                <div className="flex items-center mt-2">
                  {kpi.changeType === 'positive' ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-400 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-400 mr-1" />
                  )}
                  <span className={`text-sm ${kpi.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {kpi.change}
                  </span>
                  <span className="text-sm text-gray-400 ml-1">
                    {t('client.fromLastPeriod')}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">
              {t('client.monthlySpending')}
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 w-12">{data.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(data.spent / 25000) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-white w-20 text-right">€{(data.spent || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Breakdown */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">
              {t('client.serviceBreakdown')}
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {serviceBreakdown.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-400' :
                      index === 1 ? 'bg-green-400' :
                        index === 2 ? 'bg-yellow-400' : 'bg-purple-400'
                      }`} />
                    <span className="text-sm text-white">{service.service}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white">{service.percentage}%</div>
                    <div className="text-xs text-gray-400">€{(service.amount || 0).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Performance */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            {t('client.projectPerformance')}
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {projectPerformance.map((project, index) => (
              <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-white">{project.name}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${project.status === 'completed' ? 'text-green-400 bg-green-400/10' :
                    project.status === 'on-track' ? 'text-blue-400 bg-blue-400/10' :
                      'text-yellow-400 bg-yellow-400/10'
                    }`}>
                    {project.status === 'completed' ? t('client.completed') :
                      project.status === 'on-track' ? t('client.onTrack') : t('client.delayed')}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('client.progress')}</span>
                    <span className="text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{t('client.budget')}: €{(project.budget || 0).toLocaleString()}</span>
                    <span>{t('client.spent')}: €{(project.spent || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            {t('client.recentActivity')}
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const ActivityIcon = getActivityIcon(activity.type);
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                    <ActivityIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{activity.title}</p>
                    <p className="text-sm text-gray-400">{activity.description}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {activity.date} {activity.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAnalytics; 