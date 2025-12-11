import { useState } from 'react'
import { supabase } from '../supabase'

interface Props {
  onSave: (reading: any) => void
}

export default function GlucoseForm({ onSave }: Props) {
  const [before, setBefore] = useState('')
  const [after, setAfter] = useState('')
  const [notes, setNotes] = useState('')
  const [mealType, setMealType] = useState('desayuno') // Nuevo: tipo de comida
  const [loading, setLoading] = useState(false)
  const mealIcons = { desayuno: '☕', almuerzo: '🍲', cena: '🍽️', merienda: '🍎', noche: '🌙' }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const reading = {
      before_eating: before ? Number(before) : null,
      after_eating: after ? Number(after) : null,
      notes: `${mealIcons[mealType]} ${notes || ''}`,
      meal_type: mealType
    }
    const { data, error } = await supabase.from('glucose_readings').insert(reading).select().single()
    if (error) alert('Error: ' + error.message)
    else onSave(data)
    setLoading(false)
  }

  const getColor = (value: string) => {
    const num = Number(value)
    if (num < 70) return 'text-red-500'
    if (num > 180) return 'text-red-500'
    return 'text-green-500'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Nueva medición</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Tipo de comida</label>
          <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="w-full px-4 py-3 border rounded-xl">
            <option value="desayuno">Desayuno ☕</option>
            <option value="almuerzo">Almuerzo 🍲</option>
            <option value="cena">Cena 🍽️</option>
            <option value="merienda">Merienda 🍎</option>
            <option value="noche">Noche 🌙</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Antes de comer (mg/dL)</label>
          <input type="number" value={before} onChange={(e) => setBefore(e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-4 ${getColor(before)} focus:ring-blue-300`} placeholder="120" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">2h después (mg/dL)</label>
          <input type="number" value={after} onChange={(e) => setAfter(e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:ring-4 ${getColor(after)} focus:ring-green-300`} placeholder="140" />
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium mb-2">Notas</label>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700" placeholder="Ej: Con fruta" />
        </div>
        <div className="md:col-span-3">
          <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600">
            {loading ? 'Guardando…' : 'Guardar y programar recordatorio'}
          </button>
        </div>
      </form>
    </div>
  )
}
export default GlucoseForm
