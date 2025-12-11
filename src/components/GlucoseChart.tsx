import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { GlucoseReading } from '../types'

interface Props {
  readings: GlucoseReading[]
}

export default function GlucoseChart({ readings }: Props) {
  const data = readings
    .slice()
    .reverse()
    .map(r => ({
      fecha: new Date(r.measured_at).toLocaleDateString('es-ES'),
      antes: r.before_eating || null,
      después: r.after_eating || null
    }))

  if (readings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg">Aún no hay mediciones. ¡Empieza a registrar!</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Evolución de la glucosa</h2>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis domain={[0, 300]} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="antes" stroke="#3b82f6" fill="#93c5fd" name="Antes de comer" />
          <Area type="monotone" dataKey="después" stroke="#10b981" fill="#86efac" name="2h después" />
          <Line type="monotone" dataKey={() => 70} stroke="#ef4444" strokeDasharray="5 5" name="Límite bajo" />
          <Line type="monotone" dataKey={() => 180} stroke="#f59e0b" strokeDasharray="5 5" name="Límite alto" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
export default GlucoseChart
