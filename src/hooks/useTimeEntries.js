import { useState, useEffect, useCallback } from 'react';
import { timeEntryService } from '../services/timeEntryService';

export const useTimeEntries = () => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTimeEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await timeEntryService.getAllTimeEntries();
      setTimeEntries(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading time entries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTimeEntry = useCallback(async (timeEntryData) => {
    try {
      setLoading(true);
      setError(null);
      const newTimeEntry = await timeEntryService.createTimeEntry(timeEntryData);
      setTimeEntries(prev => [...prev, newTimeEntry]);
      return newTimeEntry;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTimeEntry = useCallback(async (id, timeEntryData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTimeEntry = await timeEntryService.updateTimeEntry(id, timeEntryData);
      setTimeEntries(prev => prev.map(te => te.id === id ? updatedTimeEntry : te));
      return updatedTimeEntry;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTimeEntry = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await timeEntryService.deleteTimeEntry(id);
      setTimeEntries(prev => prev.filter(te => te.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTimeEntriesByUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await timeEntryService.getTimeEntriesByUser(userId);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTimeEntriesByProject = useCallback(async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await timeEntryService.getTimeEntriesByProject(projectId);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTimeEntriesByTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await timeEntryService.getTimeEntriesByTask(taskId);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTimeEntriesByDate = useCallback(async (date) => {
    try {
      setLoading(true);
      setError(null);
      const data = await timeEntryService.getTimeEntriesByDate(date);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBillableTimeEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await timeEntryService.getBillableTimeEntries();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTimeEntriesByDateRange = useCallback(async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);
      const data = await timeEntryService.getTimeEntriesByDateRange(startDate, endDate);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTimeEntryStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await timeEntryService.getTimeEntryStats();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTimeEntries();
  }, [loadTimeEntries]);

  return {
    timeEntries,
    loading,
    error,
    loadTimeEntries,
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    getTimeEntriesByUser,
    getTimeEntriesByProject,
    getTimeEntriesByTask,
    getTimeEntriesByDate,
    getBillableTimeEntries,
    getTimeEntriesByDateRange,
    getTimeEntryStats
  };
}; 