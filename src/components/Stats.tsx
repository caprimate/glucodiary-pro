import { GlucoseReading } from '../types'

interface Props {
  readings: GlucoseReading[]
}

export default function Stats({ readings }: Props) {
  if (readings.length === 0) return null

  const avg = (days: number) => {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const recent = readings.filter(r => new Date(r.measured_at) > cutoff)
    const values = recent.flatMap(r => [r.before_eating, r.after_eating].filter(Boolean) as number[])
    return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0
  }

  const a1c = (avgGlucose: number) => ((avgGlucose + 46.7) / 28.7).toFixed(1)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
      <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-2xl text-center">
        <h3 className="text-lg font-semibold">Promedio 7 días</h3>
        <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{avg(7)} mg/dL</p>
      </div>
      <div className="bg-purple-100 dark:bg-purple-900 p-6 rounded-2xl text-center">
        <h3 className="text-lg font-semibold">Promedio 30 días</h3>
        <p className="text-3xl font-bold text-purple-600 dark:text-purple-300">{avg(30)} mg/dL</p>
      </div>
      <div className="bg-green-100 dark:bg-green-900 p-6 rounded-2xl text-center">
        <h3 className="text-lg font-semibold">A1c estimada</h3>
        <p className="text-3xl font-bold text-green-600 dark:text-green-300">{a1c(avg(30))} %</p>
      </div>
    </div>
  )
}
export default Stats
