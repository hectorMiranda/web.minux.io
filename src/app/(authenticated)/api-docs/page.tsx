'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSettingsStore } from '@/lib/settings';
import dynamic from 'next/dynamic';

// Dynamically import our wrapper component to avoid SSR issues
const SwaggerUIWrapper = dynamic(
  () => import('@/components/SwaggerUIWrapper'),
  { ssr: false }
);

export default function ApiDocsPage() {
  const router = useRouter();
  const { enableSwaggerDocs } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    if (!enableSwaggerDocs) {
      router.push('/settings');
      return;
    }

    const fetchSpec = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/docs');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch API documentation: ${response.statusText}`);
        }
        
        const data = await response.json();
        setSpec(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load API documentation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpec();
  }, [enableSwaggerDocs, router]);

  if (!enableSwaggerDocs) {
    return null; // Will redirect in useEffect
  }

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
        <h1 className="text-2xl font-bold">API Documentation</h1>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center">
          <div className="animate-pulse">Loading API documentation...</div>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center bg-red-500/10 border-red-500/30">
          <div className="text-red-400">{error}</div>
          <Button 
            onClick={() => router.push('/settings')} 
            className="mt-4 bg-red-500/20 hover:bg-red-500/30"
          >
            Go to Settings
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden border-0">
          <div className="swagger-ui-container dark-theme">
            {spec && <SwaggerUIWrapper spec={spec} />}
          </div>
        </Card>
      )}
    </div>
  );
} 