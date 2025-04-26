'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useSettingsStore } from '@/lib/settings';

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  description?: string;
  visible: boolean;
}

const defaultMenuItems: MenuItem[] = [
  {
    icon: 'Terminal',
    label: 'Console',
    href: '/console',
    description: 'System terminal access',
    visible: true,
  },
  {
    icon: 'Home',
    label: 'Dashboard',
    href: '/dashboard',
    description: 'System overview and status',
    visible: true,
  },
  {
    icon: 'Cpu',
    label: 'System',
    href: '/system',
    description: 'CPU, memory, and processes',
    visible: true,
  },
  {
    icon: 'Thermometer',
    label: 'Sensors',
    href: '/sensors',
    description: 'Temperature and voltage monitoring',
    visible: true,
  },
  {
    icon: 'Network',
    label: 'Network',
    href: '/network',
    description: 'Network interfaces and statistics',
    visible: true,
  },
  {
    icon: 'Wifi',
    label: 'Wi-Fi',
    href: '/wifi',
    description: 'Wireless network configuration',
    visible: true,
  },
  {
    icon: 'HardDrive',
    label: 'Storage',
    href: '/storage',
    description: 'Disk usage and management',
    visible: true,
  },
  {
    icon: 'Gauge',
    label: 'Performance',
    href: '/performance',
    description: 'System performance metrics',
    visible: true,
  },
  {
    icon: 'Settings',
    label: 'Settings',
    href: '/settings',
    description: 'System configuration',
    visible: true,
  },
  {
    icon: 'Power',
    label: 'Power',
    href: '/power',
    description: 'Power management and control',
    visible: true,
  },
  {
    icon: 'Lock',
    label: 'Security',
    href: '/security',
    description: 'System security settings',
    visible: true,
  },
  {
    icon: 'Blocks',
    label: 'Blockchain',
    href: '/blockchain',
    description: 'Blockchain-related operations',
    visible: true,
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const { menuItems, homePage, setMenuItems, setHomePage } = useSettingsStore();
  const [localMenuItems, setLocalMenuItems] = useState<MenuItem[]>(menuItems);
  const [localHomePage, setLocalHomePage] = useState<string>(homePage);

  useEffect(() => {
    if (menuItems.length === 0) {
      setLocalMenuItems(defaultMenuItems);
    }
  }, [menuItems]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(localMenuItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalMenuItems(items);
  };

  const toggleVisibility = (index: number) => {
    const items = [...localMenuItems];
    items[index] = {
      ...items[index],
      visible: !items[index].visible
    };
    setLocalMenuItems(items);
  };

  const handleSave = () => {
    setMenuItems(localMenuItems);
    setHomePage(localHomePage);
    toast.success('Settings saved successfully');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Home Page</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={localHomePage} onValueChange={setLocalHomePage}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select home page" />
              </SelectTrigger>
              <SelectContent>
                {localMenuItems.filter(item => item.visible).map((item) => (
                  <SelectItem key={item.href} value={item.href}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="menu-items">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {localMenuItems.map((item, index) => (
                      <Draggable
                        key={item.href}
                        draggableId={item.href}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center gap-4 p-4 rounded-lg ${
                              item.visible ? 'bg-white/5' : 'bg-white/5 opacity-50'
                            }`}
                          >
                            <div className="flex-1">
                              <div className="font-medium">{item.label}</div>
                              {item.description && (
                                <div className="text-sm text-white/50">
                                  {item.description}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleVisibility(index)}
                              className="hover:bg-white/10"
                            >
                              {item.visible ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
} 