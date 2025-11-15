import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Shield, BarChart3, Settings, AlertTriangle, 
  Crown, DollarSign, FileText, Database, Activity
} from 'lucide-react';

const Admin = () => {
  const [stats] = useState({
    totalUsers: 15420,
    activeUsers: 8934,
    revenue: 234580,
    securityAlerts: 3,
  });

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold glow-aqua bg-gradient-to-r from-aqua via-navy-metallic to-silver bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-silver-dark mt-2">Sistema de Control Civilizatorio</p>
        </div>
        <Badge className="bg-aqua/20 text-aqua border-aqua/30">
          <Shield className="w-4 h-4 mr-2" />
          Super Admin
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'Total Users', value: stats.totalUsers.toLocaleString(), color: 'aqua' },
          { icon: Activity, label: 'Active Users', value: stats.activeUsers.toLocaleString(), color: 'navy' },
          { icon: DollarSign, label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, color: 'silver' },
          { icon: AlertTriangle, label: 'Security Alerts', value: stats.securityAlerts, color: 'destructive' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="glass-metallic border-aqua/20 hover:shadow-epic transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-silver-dark">
                  {stat.label}
                </CardTitle>
                <Icon className={`w-5 h-5 text-${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-aqua">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="glass-panel border-aqua/20">
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card className="glass-metallic border-aqua/20">
            <CardHeader>
              <CardTitle className="text-aqua">User Management</CardTitle>
              <CardDescription className="text-silver-dark">
                Manage all users, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 glass-panel rounded-lg border border-aqua/10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-epic-gradient flex items-center justify-center">
                      <Users className="w-5 h-5 text-background" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">User Database</h3>
                      <p className="text-sm text-silver-dark">15,420 total users</p>
                    </div>
                  </div>
                  <Button className="bg-aqua/20 text-aqua hover:bg-aqua/30 border border-aqua/30">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="glass-metallic border-aqua/20">
            <CardHeader>
              <CardTitle className="text-aqua">Security Center</CardTitle>
              <CardDescription className="text-silver-dark">
                Monitor and respond to security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 glass-panel rounded-lg border border-destructive/30">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <h3 className="font-semibold text-destructive">3 Active Alerts</h3>
                  </div>
                  <p className="text-sm text-silver-dark">Requires immediate attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="glass-metallic border-aqua/20">
            <CardHeader>
              <CardTitle className="text-aqua">Analytics Dashboard</CardTitle>
              <CardDescription className="text-silver-dark">
                Platform metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-silver-dark">
                Analytics charts will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="glass-metallic border-aqua/20">
            <CardHeader>
              <CardTitle className="text-aqua">System Configuration</CardTitle>
              <CardDescription className="text-silver-dark">
                Platform settings and configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { icon: Database, label: 'Database Status', value: 'Healthy', status: 'success' },
                  { icon: FileText, label: 'API Endpoints', value: '24 Active', status: 'success' },
                  { icon: Crown, label: 'Premium Features', value: 'Enabled', status: 'success' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 glass-panel rounded-lg border border-aqua/10">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-aqua" />
                        <span className="font-medium text-foreground">{item.label}</span>
                      </div>
                      <Badge className="bg-aqua/20 text-aqua border-aqua/30">{item.value}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
