import { GlucoseReading } from '../types'

interface Props {
  readings: GlucoseReading[]
}

export default function Stats({ readings }: Props) {
  if (readings.length === 0) return null

  const avg = (readings: GlucoseReading[], days: number) => {
    const now = new Date()
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    const recent = readings.filter(r => new Date(r.measured_at) > cutoff)
    const values = recent.flatMap(r => [r.before_eating, r.after_eating].filter(Boolean) as number[])
    return values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : '0'
  }

  const a1cEstimate = (avgGlucose: number) => ((avgGlucose + 46.7) / 28.7).toFixed(1)

  const avg7 = avg(readings, 7)
  const avg30 = avg(readings, 30)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 grid md:grid-cols-3 gap-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Promedio 7 días</h3>
        <p className="text-2xl font-bold text-blue-600">{avg7} mg/dL</p>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold">Promedio 30 días</h3>
        <p className="text-2xl font-bold text-purple-600">{avg30} mg/dL</p>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold">A1c estimada</h3>
        <p className="text-2xl font-bold text-green-600">{a1cEstimate(Number(avg30))} %</p>
      </div>
    </div>
  )
}
