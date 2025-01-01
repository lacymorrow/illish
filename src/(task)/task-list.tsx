"use client";

import { useUser } from "@stackframe/stack";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Clock, X } from "lucide-react";
import { useEffect, useState } from "react";

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
  description?: string;
}

interface Task {
  id: string;
  title: string;
  due?: string;
  status: string;
  updated: string;
}

interface TaskList {
  id: string;
  title: string;
}

interface CalendarData {
  summary: string;
  description: string;
  timeZone: string;
  items: CalendarEvent[];
}

const TaskList = () => {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const user = useUser({ or: "redirect" });
  const account = user?.useConnectedAccount("google", {
    or: "redirect",
    scopes: [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/tasks.readonly",
    ],
  });
  const { accessToken } = account?.useAccessToken() ?? {};
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [overdueVisible, setOverdueVisible] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  const completeItem = (id: string) => {
    setCompletedItems([...completedItems, id]);
  };

  const snoozeItem = (id: string) => {
    console.log(`Snoozed item ${id}`);
  };

  // Function to determine overdue status for styling
  const getOverdueStatus = (dateString: string): string => {
    const date = new Date(dateString);
    const diffInHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 24) return "text-yellow-600 bg-yellow-50";
    if (diffInHours < 48) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  useEffect(() => {
    if (accessToken) {
      // Get today's date in ISO format
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Fetch calendar events for today from Google Calendar API
      fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${today.toISOString()}&timeMax=${tomorrow.toISOString()}&singleEvents=true&orderBy=startTime`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
        .then((res) => res.json())
        .then((data: CalendarData) => {
          console.log("Calendar data:", data);
          setCalendarData(data);
        })
        .catch((err) => {
          console.error("Error fetching events:", err);
          setError("Failed to fetch calendar events. Please try again later.");
        });

      // Fetch all task lists
      fetch("https://tasks.googleapis.com/tasks/v1/users/@me/lists", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => res.json())
        .then((data: { items: TaskList[] }) => {
          console.log("Task lists:", data);
          // Fetch tasks from all lists
          return Promise.all(
            data.items.map((list) =>
              fetch(
                `https://tasks.googleapis.com/tasks/v1/lists/${list.id}/tasks?showCompleted=false`,
                {
                  headers: { Authorization: `Bearer ${accessToken}` },
                },
              ).then((res) => res.json()),
            ),
          );
        })
        .then((tasksData) => {
          console.log("All tasks data:", tasksData);
          const allTasks = tasksData.flatMap((data) => data.items || []);
          setTasks(allTasks);
        })
        .catch((err) => {
          console.error("Error fetching tasks:", err);
          setError("Failed to fetch tasks. Please try again later.");
        });
    }
  }, [accessToken]);

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString();
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="relative w-full overflow-hidden p-6 font-sans">
      <h1 className="mb-6 text-3xl font-semibold text-gray-800">
        Today's Events
      </h1>

      {/* Today's Calendar Events */}
      <div className="mb-6 space-y-4">
        {calendarData?.items.map((event) => (
          <div
            key={event.id}
            className={`overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 ease-in-out ${
              expandedEvent === event.id ? "h-auto" : "h-16"
            } ${completedItems.includes(event.id) ? "opacity-50" : ""}`}
          >
            <div
              className="flex h-16 cursor-pointer items-center justify-between px-4"
              onClick={() => toggleExpand(event.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-purple-400" />
                <span className="text-sm font-medium text-gray-700">
                  {formatTime(event.start.dateTime)}
                </span>
                <span className="text-base text-gray-900">{event.summary}</span>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                  expandedEvent === event.id ? "rotate-90 transform" : ""
                }`}
              />
            </div>
            {expandedEvent === event.id && (
              <div className="px-4 pb-4">
                <p className="mb-2 text-sm text-gray-600">
                  {event?.description ?? "No additional details"}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => completeItem(event.id)}
                    className="flex items-center justify-center rounded-md bg-green-50 px-3 py-1 text-sm text-green-700 transition-colors duration-300 hover:bg-green-100"
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Complete
                  </button>
                  <button
                    onClick={() => snoozeItem(event.id)}
                    className="flex items-center justify-center rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-700 transition-colors duration-300 hover:bg-blue-100"
                  >
                    <Clock className="mr-1 h-4 w-4" />
                    Snooze
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tasks */}
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">Your Tasks</h2>
      {tasks.length ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 ease-in-out ${
                expandedEvent === task.id ? "h-auto" : "h-16"
              } ${completedItems.includes(task.id) ? "opacity-50" : ""}`}
            >
              <div
                className="flex h-16 cursor-pointer items-center justify-between px-4"
                onClick={() => toggleExpand(task.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="text-base text-gray-900">
                    {task.title || "(No title)"}
                  </span>
                </div>
                <ChevronRight
                  className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                    expandedEvent === task.id ? "rotate-90 transform" : ""
                  }`}
                />
              </div>
              {expandedEvent === task.id && (
                <div className="px-4 pb-4">
                  <span className="text-sm text-gray-600">
                    Status: {task.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    Due: {task.due ? formatDate(task.due) : "No due date"}
                  </span>
                  <span className="text-sm text-gray-600">
                    Last updated: {formatDate(task.updated)}
                  </span>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => completeItem(task.id)}
                      className="flex items-center justify-center rounded-md bg-green-50 px-3 py-1 text-sm text-green-700 transition-colors duration-300 hover:bg-green-100"
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Complete
                    </button>
                    <button
                      onClick={() => snoozeItem(task.id)}
                      className="flex items-center justify-center rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-700 transition-colors duration-300 hover:bg-blue-100"
                    >
                      <Clock className="mr-1 h-4 w-4" />
                      Snooze
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No tasks found. You can add tasks using Google Tasks.</p>
      )}

      {/* Overdue Tasks */}
      <AnimatePresence>
        {overdueVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 right-6 z-50"
          >
            <div className="space-y-4 rounded-lg bg-white p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Overdue Tasks
                </h2>
                <button
                  onClick={() => setOverdueVisible(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {tasks
                .filter(
                  (task) =>
                    task.status !== "completed" &&
                    task.due &&
                    new Date(task.due) < new Date(),
                )
                .map((task, index) => (
                  <div
                    key={task.id}
                    className={`${getOverdueStatus(task.due!)} rounded-lg p-4 ${
                      index === 0 ? "" : "mt-2"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">{task.title}</span>
                      <span className="text-sm">{formatDate(task.due!)}</span>
                    </div>
                    <p className="text-sm">
                      Last updated: {formatDate(task.updated)}
                    </p>
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => completeItem(task.id)}
                        className="flex items-center justify-center rounded-md bg-white bg-opacity-50 px-3 py-1 text-sm transition-colors duration-300 hover:bg-opacity-75"
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Complete
                      </button>
                      <button
                        onClick={() => snoozeItem(task.id)}
                        className="flex items-center justify-center rounded-md bg-white bg-opacity-50 px-3 py-1 text-sm transition-colors duration-300 hover:bg-opacity-75"
                      >
                        <Clock className="mr-1 h-4 w-4" />
                        Snooze
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
