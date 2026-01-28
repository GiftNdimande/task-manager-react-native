/**
 * Date utility functions for formatting and manipulation
 */

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isOverdue = (dueDateString?: string): boolean => {
  if (!dueDateString) return false;
  const dueDate = new Date(dueDateString);
  const now = new Date();
  return dueDate < now;
};

export const getDaysUntilDue = (dueDateString?: string): number | null => {
  if (!dueDateString) return null;
  const dueDate = new Date(dueDateString);
  const now = new Date();
  const diffInMs = dueDate.getTime() - now.getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
};

export const formatDueDate = (dueDateString?: string): string => {
  if (!dueDateString) return 'No due date';
  
  const daysUntil = getDaysUntilDue(dueDateString);
  
  if (daysUntil === null) return 'No due date';
  if (daysUntil < 0) return `Overdue by ${Math.abs(daysUntil)} days`;
  if (daysUntil === 0) return 'Due today';
  if (daysUntil === 1) return 'Due tomorrow';
  if (daysUntil < 7) return `Due in ${daysUntil} days`;
  
  return formatDate(dueDateString);
};
