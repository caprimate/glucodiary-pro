import { supabase } from '../supabase'
import { GlucoseReading } from '../types'

interface Props {
  readings: GlucoseReading[]
  onDelete: () => void
}

export default function GlucoseTable({ readings, onDelete }: Props) {
  const exportCSV = () => {
    const csv = [
      ['Fecha y hora', 'Antes (mg/dL)', 'Después (mg/dL)', 'Notas'],
      ...readings.map(r => [
        new Date(r.measured_at).toLocaleString('es-ES'),
        r.before_eating || '',
        r.after_eating || '',
        r.notes || ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'glucodiary_mediciones.csv'
    link.click()
  }

  const deleteReading = async (id: number) => {
    if (!confirm('¿Eliminar esta medición?')) return
    const { error } = await supabase.from('glucose_readings').delete().eq('id', id)
    if (error) alert('Error al eliminar')
    else onDelete()
  }

  if (readings.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Historial completo</h2>
          <button onClick={exportCSV} className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-gray-100 transition">
            Exportar CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Fecha y hora</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Antes</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Después</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Notas</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {readings.map(r => (
              <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 text-sm">{new Date(r.measured_at).toLocaleString('es-ES')}</td>
                <td className="px-6 py-4 text-sm font-medium">{r.before_eating || '—'}</td>
                <td className="px-6 py-4 text-sm font-medium">{r.after_eating || '—'}</td>
                <td className="px-6 py-4 text-sm max-w-xs truncate">{r.notes || '—'}</td>
                <td className="px-6 py-4">
                  <button onClick={() => deleteReading(r.id)} className="text-red-600 hover:text-red-800 font-medium">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
