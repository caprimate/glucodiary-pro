import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { GlucoseReading } from './types'
import { Auth } from './components/Auth'
import { GlucoseForm } from './components/GlucoseForm'
import { GlucoseChart } from './components/GlucoseChart'
import { GlucoseTable } from './components/GlucoseTable'
import { Stats } from './components/Stats'

function App() {
  const [user, setUser] = useState<any>(null)
  const [readings, setReadings] = useState<GlucoseReading[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [pendingReminder, setPendingReminder] = useState<string | null>(null)

  useEffect(() => {
    // Modo oscuro automático
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)
    document.documentElement.classList.toggle('dark', prefersDark)

    // Cargar recordatorios pendientes
    const reminder = localStorage.getItem('pendingReminder')
    if (reminder) setPendingReminder(reminder)
  }, [])

  const loadReadings = async (userId: string) => {
    const { data } = await supabase
      .from('glucose_readings')
      .select('*')
      .eq('user_id', userId)
      .order('measured_at', { ascending: false })
    setReadings(data || [])
  }

  // ... resto igual al anterior, pero agrega:
  useEffect(() => {
    if (user) loadReadings(user.id)
  }, [user])

  if (!user) return <Auth />

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-5xl mx-auto p-6">
        <header className="flex justify-between items-center mb-10 pt-6">
          <h1 className="text-5xl font-bold text-indigo-800 dark:text-indigo-200">🍎 GlucoDiary PRO</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setDarkMode(!darkMode)
                document.documentElement.classList.toggle('dark')
              }}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => supabase.auth.signOut()} className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600">
              Cerrar sesión
            </button>
          </div>
        </header>

        {pendingReminder && (
          <div className="bg-yellow-500 text-white p-4 rounded-xl mb-4 text-center">
            ⏰ ¡Recordatorio! Mide tu glucosa 2h después. <button onClick={() => { setPendingReminder(null); localStorage.removeItem('pendingReminder'); }} className="underline ml-2">Hecho</button>
          </div>
        )}

        <GlucoseForm onSave={(newReading: GlucoseReading) => {
          loadReadings(user.id)
          // Programar recordatorio a 2h
          setTimeout(() => {
            if (Notification.permission === 'granted') {
              new Notification('¡Hora de medir después de comer!', { body: 'Abre GlucoDiary para registrar' })
            }
            localStorage.setItem('pendingReminder', newReading.id.toString())
            setPendingReminder(newReading.id.toString())
          }, 2 * 60 * 60 * 1000) // 2 horas
        }} />

        <Stats readings={readings} />

        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          <GlucoseChart readings={readings} />
          <GlucoseTable readings={readings} onDelete={() => loadReadings(user.id)} />
        </div>
      </div>
    </div>
  )
}

export default App
