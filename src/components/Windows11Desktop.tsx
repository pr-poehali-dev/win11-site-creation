import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import WindowsLogo from './WindowsLogo';
import CalculatorApp from './CalculatorApp';
import PaintApp from './PaintApp';

interface DesktopApp {
  id: string;
  name: string;
  icon: string;
  color?: string;
  component?: string;
}

interface WindowState {
  id: string;
  title: string;
  content: string;
  component?: string;
  minimized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

const desktopApps: DesktopApp[] = [
  { id: 'edge', name: 'Microsoft Edge', icon: 'Globe', color: '#0078D4' },
  { id: 'explorer', name: 'Проводник', icon: 'Folder', color: '#FFB900' },
  { id: 'calculator', name: 'Калькулятор', icon: 'Calculator', color: '#0078D4', component: 'calculator' },
  { id: 'paint', name: 'Paint', icon: 'Paintbrush', color: '#0067C0', component: 'paint' },
  { id: 'store', name: 'Microsoft Store', icon: 'ShoppingBag', color: '#0078D4' },
  { id: 'settings', name: 'Параметры', icon: 'Settings', color: '#0067C0' },
  { id: 'photos', name: 'Фотографии', icon: 'Image', color: '#0078D4' },
  { id: 'notepad', name: 'Блокнот', icon: 'FileText', color: '#0067C0' },
];

const pinnedApps: DesktopApp[] = [
  { id: 'edge', name: 'Edge', icon: 'Globe' },
  { id: 'explorer', name: 'Проводник', icon: 'Folder' },
  { id: 'calculator', name: 'Калькулятор', icon: 'Calculator', component: 'calculator' },
  { id: 'paint', name: 'Paint', icon: 'Paintbrush', component: 'paint' },
  { id: 'store', name: 'Store', icon: 'ShoppingBag' },
  { id: 'photos', name: 'Фото', icon: 'Image' },
  { id: 'notepad', name: 'Блокнот', icon: 'FileText' },
  { id: 'settings', name: 'Параметры', icon: 'Settings' },
];

export default function Windows11Desktop() {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showWidgets, setShowWidgets] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [time, setTime] = useState(new Date());
  const [draggingWindow, setDraggingWindow] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const openApp = (app: DesktopApp) => {
    const newWindow: WindowState = {
      id: `${app.id}-${Date.now()}`,
      title: app.name,
      content: app.name,
      component: app.component,
      minimized: false,
      x: 100 + windows.length * 30,
      y: 100 + windows.length * 30,
      width: app.component === 'calculator' ? 350 : app.component === 'paint' ? 800 : 800,
      height: app.component === 'calculator' ? 480 : app.component === 'paint' ? 600 : 600,
    };
    setWindows([...windows, newWindow]);
    setShowStartMenu(false);
    playSound('open');
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    playSound('close');
  };

  const minimizeWindow = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, minimized: true } : w));
    playSound('minimize');
  };

  const restoreWindow = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, minimized: false } : w));
  };

  const handleMouseDown = (e: React.MouseEvent, windowId: string) => {
    const windowElement = e.currentTarget.parentElement as HTMLElement;
    const rect = windowElement.getBoundingClientRect();
    setDraggingWindow(windowId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingWindow) {
      setWindows(windows.map(w => {
        if (w.id === draggingWindow) {
          return {
            ...w,
            x: Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - w.width)),
            y: Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - w.height - 56)),
          };
        }
        return w;
      }));
    }
  };

  const handleMouseUp = () => {
    setDraggingWindow(null);
  };

  const playSound = (type: string) => {
    const audio = new Audio();
    if (type === 'open') audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDGJ0fPTgjMGHm7A7+OZSA0PVKzn7bBdGAg+ltryxnMnBSuAzvLaijgIG2i88OScTQwQT6fj8LdjHAY4kdXy';
  };

  const renderWindowContent = (window: WindowState) => {
    if (window.component === 'calculator') {
      return <CalculatorApp />;
    }
    if (window.component === 'paint') {
      return <PaintApp />;
    }
    return (
      <div className="p-6">
        <p className="text-muted-foreground mb-4">Приложение {window.title}</p>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-4 hover:bg-accent transition-colors cursor-pointer">
              <Icon name="File" size={32} className="mb-2 text-primary" />
              <p className="text-sm">Файл {i}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: theme === 'light' 
            ? 'url(https://wallpaperaccess.com/full/6606655.jpg)'
            : 'url(https://wallpaperaccess.com/full/6606656.jpg)',
          backgroundSize: 'cover',
        }}
      />

      <div className="absolute inset-0 grid grid-cols-6 gap-8 p-8 content-start">
        {desktopApps.map((app) => (
          <button
            key={app.id}
            onClick={() => openApp(app)}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: app.color }}>
              <Icon name={app.icon} size={24} />
            </div>
            <span className="text-white text-xs font-medium text-center drop-shadow-lg group-hover:drop-shadow-xl">
              {app.name}
            </span>
          </button>
        ))}
      </div>

      {windows.filter(w => !w.minimized).map((window) => (
        <Card
          key={window.id}
          className="absolute window-shadow animate-fade-in overflow-hidden rounded-xl"
          style={{
            left: window.x,
            top: window.y,
            width: window.width,
            height: window.height,
            cursor: draggingWindow === window.id ? 'grabbing' : 'default',
          }}
        >
          <div 
            className="flex items-center justify-between px-4 py-3 border-b bg-background cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => handleMouseDown(e, window.id)}
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary flex items-center justify-center">
                <Icon name="AppWindow" size={10} className="text-white" />
              </div>
              <span className="text-sm font-medium">{window.title}</span>
            </div>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-10 hover:bg-accent rounded-none"
                onClick={() => minimizeWindow(window.id)}
              >
                <Icon name="Minus" size={12} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-10 hover:bg-accent rounded-none"
              >
                <Icon name="Square" size={12} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-10 hover:bg-destructive hover:text-white rounded-none"
                onClick={() => closeWindow(window.id)}
              >
                <Icon name="X" size={12} />
              </Button>
            </div>
          </div>
          <div className="bg-background h-[calc(100%-53px)] overflow-auto">
            {renderWindowContent(window)}
          </div>
        </Card>
      ))}

      {showStartMenu && (
        <Card className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[640px] glass-effect dark:glass-effect-dark border-0 animate-slide-up rounded-xl">
          <div className="p-6">
            <Input
              placeholder="Введите здесь для поиска"
              className="mb-6 bg-background/50 h-12 text-base rounded-lg"
            />
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-4">Закреплённые</h3>
              <div className="grid grid-cols-6 gap-3">
                {pinnedApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => openApp(app)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-all"
                  >
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white">
                      <Icon name={app.icon} size={22} />
                    </div>
                    <span className="text-[10px] text-center leading-tight">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {showWidgets && (
        <Card className="absolute left-4 top-16 bottom-16 w-[400px] glass-effect dark:glass-effect-dark border-0 animate-slide-up rounded-xl">
          <ScrollArea className="h-full p-6">
            <h2 className="text-xl font-semibold mb-4">Виджеты</h2>
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Cloud" size={24} />
                  <div>
                    <p className="text-2xl font-bold">22°C</p>
                    <p className="text-sm text-muted-foreground">Москва</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Новости</h3>
                <p className="text-sm text-muted-foreground">Последние события дня...</p>
              </Card>
            </div>
          </ScrollArea>
        </Card>
      )}

      {showNotifications && (
        <Card className="absolute right-4 top-16 bottom-16 w-[400px] glass-effect dark:glass-effect-dark border-0 animate-slide-up rounded-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Уведомления</h2>
              <Button variant="ghost" size="sm">Очистить</Button>
            </div>
            <p className="text-muted-foreground text-center py-8">Нет новых уведомлений</p>
          </div>
        </Card>
      )}

      {showSearch && (
        <Card className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] glass-effect dark:glass-effect-dark border-0 animate-fade-in rounded-xl">
          <div className="p-6">
            <Input
              placeholder="Поиск в Windows"
              className="mb-4 text-lg h-12"
              autoFocus
            />
            <div className="space-y-2">
              {pinnedApps.slice(0, 3).map((app) => (
                <button
                  key={app.id}
                  onClick={() => openApp(app)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-all"
                >
                  <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
                    <Icon name={app.icon} size={16} />
                  </div>
                  <span className="text-sm">{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-12 glass-effect dark:glass-effect-dark taskbar-shadow flex items-center justify-center gap-1 px-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 hover:bg-white/10 dark:hover:bg-white/5"
          onClick={() => setShowStartMenu(!showStartMenu)}
        >
          <WindowsLogo size={18} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 hover:bg-white/10 dark:hover:bg-white/5"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Icon name="Search" size={18} />
        </Button>

        <div className="flex-1 flex justify-center gap-1">
          {windows.map((window) => (
            <Button
              key={window.id}
              variant={window.minimized ? "ghost" : "secondary"}
              size="icon"
              className="w-12 h-12 hover:bg-white/10 dark:hover:bg-white/5"
              onClick={() => window.minimized ? restoreWindow(window.id) : minimizeWindow(window.id)}
            >
              <Icon name="AppWindow" size={18} />
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 hover:bg-white/10 dark:hover:bg-white/5"
          onClick={() => setShowWidgets(!showWidgets)}
        >
          <Icon name="LayoutGrid" size={18} />
        </Button>

        <div className="ml-auto flex items-center gap-2 px-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 hover:bg-white/10 dark:hover:bg-white/5"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 hover:bg-white/10 dark:hover:bg-white/5"
          >
            <Icon name="Wifi" size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 hover:bg-white/10 dark:hover:bg-white/5"
          >
            <Icon name="Volume2" size={16} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="px-3 h-10 hover:bg-white/10 dark:hover:bg-white/5"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <div className="text-right text-xs leading-tight">
              <div>{time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="text-muted-foreground">
                {time.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
