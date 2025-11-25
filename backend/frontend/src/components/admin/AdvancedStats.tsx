import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { MapPin, TrendingUp, Users, FileText, CheckCircle, Calendar, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import adminApi from '../../services/adminApi';

export const AdvancedStats: React.FC = () => {
    const [institutionsByRegion, setInstitutionsByRegion] = useState<any>(null);
    const [monthlyActivity, setMonthlyActivity] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAdvancedStats();
    }, []);

    const loadAdvancedStats = async () => {
        setLoading(true);
        try {
            console.log('📊 Cargando estadísticas avanzadas...');

            const [regionsData, activityData] = await Promise.all([
                adminApi.getInstitutionsByRegion().catch(err => {
                    console.error('❌ Error en getInstitutionsByRegion:', err);
                    return { success: false, data: {}, error: err.message };
                }),
                adminApi.getMonthlyActivity().catch(err => {
                    console.error('❌ Error en getMonthlyActivity:', err);
                    return { success: false, data: {}, error: err.message };
                }),
            ]);

            console.log('✅ Datos recibidos:', {
                regions: regionsData,
                activity: activityData
            });

            // Extraer los datos correctamente de la respuesta
            const regionsResult = regionsData?.data || regionsData || {};
            const activityResult = activityData?.data || activityData || {};

            console.log('📊 Datos procesados:', {
                regions: regionsResult,
                activity: activityResult
            });

            setInstitutionsByRegion(regionsResult);
            setMonthlyActivity({
                newRegistrations: activityResult.newRegistrations || 0,
                tasksCreated: activityResult.tasksCreated || 0,
                gradesSubmitted: activityResult.gradesSubmitted || 0,
                reportsGenerated: activityResult.reportsGenerated || 0
            });

            console.log('✅ Estadísticas avanzadas cargadas exitosamente');
        } catch (error: any) {
            console.error('❌ Error loading advanced stats:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack,
                response: error.response
            });

            // Establecer datos vacíos en caso de error
            setInstitutionsByRegion({});
            setMonthlyActivity({
                newRegistrations: 0,
                tasksCreated: 0,
                gradesSubmitted: 0,
                reportsGenerated: 0
            });
        } finally {
            setLoading(false);
        }
    };

    // Datos para el gráfico de pie
    const pieChartData = institutionsByRegion ? {
        labels: Object.keys(institutionsByRegion),
        datasets: [
            {
                data: Object.values(institutionsByRegion),
                backgroundColor: [
                    '#3B82F6', // Azul
                    '#10B981', // Verde
                    '#F59E0B', // Naranja
                    '#EF4444', // Rojo
                    '#8B5CF6', // Púrpura
                ],
                borderWidth: 2,
                borderColor: '#fff',
            },
        ],
    } : null;

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-48 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header con botón de recarga */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">📊 Estadísticas Avanzadas</h2>
                <Button
                    onClick={loadAdvancedStats}
                    variant="outline"
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Cargando...' : 'Actualizar'}
                </Button>
            </div>

            {/* Instituciones por Ubicación */}
            <Card className="border-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Instituciones por Ubicación
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {institutionsByRegion && Object.keys(institutionsByRegion).length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Gráfico de pie */}
                            <div className="flex items-center justify-center">
                                <div className="w-full max-w-sm h-64">
                                    {pieChartData && <Pie data={pieChartData} options={pieChartOptions} />}
                                </div>
                            </div>
                            
                            {/* Lista de ubicaciones */}
                            <div className="space-y-2">
                                {Object.entries(institutionsByRegion)
                                    .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
                                    .map(([region, count]: [string, any]) => (
                                        <div 
                                            key={region} 
                                            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <MapPin className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <span className="font-semibold text-gray-900">{region}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl font-bold text-blue-600">{count}</span>
                                                <span className="text-sm text-gray-500">
                                                    {count === 1 ? 'institución' : 'instituciones'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">No hay datos de instituciones por ubicación</p>
                            <p className="text-sm mt-2">Las instituciones aparecerán aquí cuando se registren con su dirección</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Actividad Mensual */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Actividad Mensual
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <Users className="w-6 h-6 text-blue-600" />
                                <span className="text-sm text-gray-600">Nuevos Registros</span>
                            </div>
                            <p className="text-3xl font-bold text-blue-600">
                                +{monthlyActivity?.newRegistrations || 0}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <FileText className="w-6 h-6 text-green-600" />
                                <span className="text-sm text-gray-600">Tareas Creadas</span>
                            </div>
                            <p className="text-3xl font-bold text-green-600">
                                +{monthlyActivity?.tasksCreated || 0}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="w-6 h-6 text-purple-600" />
                                <span className="text-sm text-gray-600">Calificaciones</span>
                            </div>
                            <p className="text-3xl font-bold text-purple-600">
                                +{monthlyActivity?.gradesSubmitted || 0}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <Calendar className="w-6 h-6 text-orange-600" />
                                <span className="text-sm text-gray-600">Reportes Generados</span>
                            </div>
                            <p className="text-3xl font-bold text-orange-600">
                                +{monthlyActivity?.reportsGenerated || 0}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>


        </div>
    );
};
