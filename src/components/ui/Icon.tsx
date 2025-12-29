import {
  Activity,
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  Server,
  Settings,
  Wrench,
  User,
  Users,
  X,
  AlertTriangle,
  BarChart3,
  Download,
  type LucideIcon,
  HelpCircle,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Activity,
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  Server,
  Settings,
  Tool: Wrench,
  User,
  Users,
  X,
  AlertTriangle,
  BarChart3,
  Download,
  HelpCircle,
}

interface IconProps {
  name?: string
  size?: number
  className?: string
}

export function Icon({ name, size = 20, className }: IconProps) {
  if (!name) {
    const DefaultIcon = iconMap.HelpCircle
    return <DefaultIcon size={size} className={className} />
  }

  const IconComponent = iconMap[name] || iconMap.HelpCircle

  return <IconComponent size={size} className={className} />
}
