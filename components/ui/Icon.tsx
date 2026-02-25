"use client";

import {
  MdDashboard,
  MdEditNote,
  MdPsychology,
  MdScience,
  MdLogout,
  MdAdd,
  MdAddCircle,
  MdError,
  MdSave,
  MdDelete,
  MdList,
  MdLocalFireDepartment,
  MdTrendingUp,
  MdEmojiEvents,
  MdPersonAdd,
  MdLogin,
  MdChevronRight,
  MdCheckCircle,
  MdHistory,
  MdCancel,
  MdArrowForward,
  MdTerminal,
} from "react-icons/md";

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  dashboard: MdDashboard,
  edit_note: MdEditNote,
  psychology: MdPsychology,
  science: MdScience,
  logout: MdLogout,
  add: MdAdd,
  add_circle: MdAddCircle,
  error: MdError,
  save: MdSave,
  delete: MdDelete,
  list_alt: MdList,
  local_fire_department: MdLocalFireDepartment,
  trending_up: MdTrendingUp,
  emoji_events: MdEmojiEvents,
  person_add: MdPersonAdd,
  login: MdLogin,
  chevron_right: MdChevronRight,
  check_circle: MdCheckCircle,
  history: MdHistory,
  cancel: MdCancel,
  arrow_forward: MdArrowForward,
  terminal: MdTerminal,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className = "" }: IconProps) {
  const Component = iconMap[name];
  if (!Component) {
    return null;
  }
  return (
    <Component
      className={`select-none inline-block shrink-0 ${className}`}
      size={size}
      aria-hidden
    />
  );
}
