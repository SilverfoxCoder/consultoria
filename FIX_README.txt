I have fixed the issue where activated users were not appearing in the client list.

**The Problem:** The system was strictly looking for the role `"CLIENT"` (uppercase), but the user was saved as `"Client"` (mixed case), causing a mismatch.

**The Fix:**
1.  **Flexible Search**: Updated the backend to search for clients case-insensitively (so "Client", "client", and "CLIENT" all work).
2.  **Data Consistency**: Modified the user update logic to always save roles in uppercase from now on.

I have built (`mvn package`) and restarted the backend server.
Please **refresh your browser** and check the Client List again. "David Repadavi" should now be visible.
