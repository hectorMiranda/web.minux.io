'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Save, ArrowLeft, Eye, EyeOff, ToggleRight, ToggleLeft, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useSettingsStore } from '@/lib/settings';
import { iconMap } from '@/lib/icons';
import type { MenuItem } from '@/lib/settings';

export default function SettingsPage() {
  const router = useRouter();
  const { menuItems, homePage, enableSwaggerDocs, setMenuItems, setHomePage, setEnableSwaggerDocs } = useSettingsStore();
  const [localMenuItems, setLocalMenuItems] = useState<MenuItem[]>(menuItems);
  const [localHomePage, setLocalHomePage] = useState<string>(homePage);
  const [localEnableSwaggerDocs, setLocalEnableSwaggerDocs] = useState<boolean>(enableSwaggerDocs);

  useEffect(() => {
    setLocalMenuItems(menuItems);
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

  const toggleEnabled = (index: number) => {
    const items = [...localMenuItems];
    items[index] = {
      ...items[index],
      enabled: !items[index].enabled
    };
    setLocalMenuItems(items);
  };

  const handleSave = () => {
    setMenuItems(localMenuItems);
    setHomePage(localHomePage);
    setEnableSwaggerDocs(localEnableSwaggerDocs);
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
                {localMenuItems.filter(item => item.visible && item.enabled).map((item) => (
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
            <CardTitle>Developer Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <FileJson className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-medium">Swagger API Documentation</div>
                  <div className="text-sm text-white/50">
                    Enable OpenAPI documentation for API endpoints
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocalEnableSwaggerDocs(!localEnableSwaggerDocs)}
                className="hover:bg-white/10"
                title={localEnableSwaggerDocs ? "Enabled" : "Disabled"}
              >
                {localEnableSwaggerDocs ? (
                  <ToggleRight className="h-6 w-6 text-green-400" />
                ) : (
                  <ToggleLeft className="h-6 w-6" />
                )}
              </Button>
            </div>
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
                    {localMenuItems.map((item, index) => {
                      const IconComponent = iconMap[item.icon];
                      return (
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
                                item.enabled ? 'bg-white/5' : 'bg-white/5 opacity-50'
                              }`}
                            >
                              {IconComponent && <IconComponent className="w-5 h-5" />}
                              <div className="flex-1">
                                <div className="font-medium">{item.label}</div>
                                {item.description && (
                                  <div className="text-sm text-white/50">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleEnabled(index)}
                                  className="hover:bg-white/10"
                                  title={item.enabled ? "Enabled" : "Disabled"}
                                >
                                  {item.enabled ? (
                                    <ToggleRight className="h-4 w-4 text-green-400" />
                                  ) : (
                                    <ToggleLeft className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleVisibility(index)}
                                  className="hover:bg-white/10"
                                  title={item.visible ? "Visible" : "Hidden"}
                                >
                                  {item.visible ? (
                                    <Eye className="h-4 w-4" />
                                  ) : (
                                    <EyeOff className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
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