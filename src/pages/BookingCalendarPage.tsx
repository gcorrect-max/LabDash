"use client"
import React, { useEffect, useMemo, useState } from 'react'
import styles from './BookingCalendarPage.module.css'
import { bookingsApi } from '@/services/api'

interface BookingEvent {
  id: string
  title: string
  start: string // ISO
  end: string // ISO
  description?: string
  attendees?: string[]
}

export function BookingCalendarPage(): JSX.Element {
  const [events, setEvents] = useState<BookingEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [currentDate, setCurrentDate] = useState(() => new Date())

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<BookingEvent | null>(null)

  const [form, setForm] = useState({
    title: '',
    start: '',
    end: '',
    description: '',
    attendees: '',
  })

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    setLoading(true)
    try {
      const data = await bookingsApi.getAll()
      setEvents(data)
    } catch (err: any) {
      setError(err?.message || 'Błąd podczas pobierania rezerwacji')
    } finally {
      setLoading(false)
    }
  }

  function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }

  function getMonthGrid(date: Date) {
    const start = startOfMonth(date)
    const firstDay = start.getDay() // 0-6 Sun-Sat
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

    const cells: Array<{ date: Date; inMonth: boolean }> = []

    // previous month days
    const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1
    for (let i = prevMonthDays; i > 0; i--) {
      const d = new Date(start)
      d.setDate(start.getDate() - i)
      cells.push({ date: d, inMonth: false })
    }

    // current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(date.getFullYear(), date.getMonth(), d), inMonth: true })
    }

    // next month to fill grid to 42 cells
    while (cells.length % 7 !== 0 || cells.length < 42) {
      const last = cells[cells.length - 1].date
      const d = new Date(last)
      d.setDate(last.getDate() + 1)
      cells.push({ date: d, inMonth: false })
    }

    return cells
  }

  const monthGrid = useMemo(() => getMonthGrid(currentDate), [currentDate])

  function eventsForDay(day: Date) {
    const startOfDay = new Date(day)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(day)
    endOfDay.setHours(23, 59, 59, 999)

    return events.filter((e) => {
      const s = new Date(e.start)
      const en = new Date(e.end)
      return s <= endOfDay && en >= startOfDay
    })
  }

  function changeMonth(offset: number) {
    const d = new Date(currentDate)
    d.setMonth(d.getMonth() + offset)
    setCurrentDate(d)
  }

  function gotoToday() {
    setCurrentDate(new Date())
  }

  function openNewFor(date: Date) {
    const iso = new Date(date)
    iso.setHours(9, 0, 0, 0)
    const iso2 = new Date(iso)
    iso2.setHours(10, 0, 0, 0)

    setEditing(null)
    setForm({
      title: '',
      start: iso.toISOString().slice(0, 16),
      end: iso2.toISOString().slice(0, 16),
      description: '',
      attendees: '',
    })
    setShowModal(true)
  }

  function openEdit(evt: BookingEvent) {
    setEditing(evt)
    setForm({
      title: evt.title,
      start: evt.start.slice(0, 16),
      end: evt.end.slice(0, 16),
      description: evt.description || '',
      attendees: (evt.attendees || []).join(', '),
    })
    setShowModal(true)
  }

  async function saveForm() {
    try {
      const payload = {
        title: form.title,
        start: new Date(form.start).toISOString(),
        end: new Date(form.end).toISOString(),
        description: form.description,
        attendees: form.attendees.split(',').map((a) => a.trim()).filter(Boolean),
      }

      if (editing) {
        await bookingsApi.update(editing.id, payload)
      } else {
        await bookingsApi.create(payload)
      }

      await loadEvents()
      setShowModal(false)
    } catch (err: any) {
      setError(err?.message || 'Błąd podczas zapisu rezerwacji')
    }
  }

  async function deleteEvent(id: string) {
    if (!confirm('Czy na pewno usunąć tę rezerwację?')) return
    try {
      await bookingsApi.delete(id)
      await loadEvents()
      setShowModal(false)
    } catch (err: any) {
      setError(err?.message || 'Błąd podczas usuwania rezerwacji')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.leftControls}>
          <button onClick={() => changeMonth(-1)} className={styles.ctrl}>◀</button>
          <button onClick={gotoToday} className={styles.ctrl}>Dziś</button>
          <button onClick={() => changeMonth(1)} className={styles.ctrl}>▶</button>
        </div>
        <div className={styles.centerTitle}>
          <h2>{currentDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</h2>
        </div>
        <div className={styles.rightControls}>
          <select value={view} onChange={(e) => setView(e.target.value as any)}>
            <option value="month">Miesiąc</option>
            <option value="week">Tydzień</option>
            <option value="day">Dzień</option>
          </select>
          <button onClick={() => openNewFor(new Date())} className={styles.addBtn}>Dodaj</button>
        </div>
      </div>

      {loading && <div className={styles.loading}>Ładowanie...</div>}
      {error && <div className={styles.error}>{error}</div>}

      {view === 'month' && (
        <div className={styles.calendarGrid}>
          <div className={styles.weekDays}>
            {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'].map((d) => (
              <div key={d} className={styles.weekDay}>{d}</div>
            ))}
          </div>

          <div className={styles.daysGrid}>
            {monthGrid.map((cell, idx) => (
              <div key={idx} className={`${styles.dayCell} ${cell.inMonth ? '' : styles.outside}`}> 
                <div className={styles.dayHeader} onDoubleClick={() => openNewFor(cell.date)}>
                  <span>{cell.date.getDate()}</span>
                </div>
                <div className={styles.eventsList}>
                  {eventsForDay(cell.date).slice(0, 3).map((ev) => (
                    <div key={ev.id} className={styles.eventItem} onClick={() => openEdit(ev)}>
                      <strong>{ev.title}</strong>
                      <div className={styles.eventTime}>{new Date(ev.start).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(view === 'week' || view === 'day') && (
        <div className={styles.listView}>
          {events.sort((a,b)=>new Date(a.start).getTime()-new Date(b.start).getTime()).map((ev)=> (
            <div key={ev.id} className={styles.listItem} onClick={()=>openEdit(ev)}>
              <div className={styles.listTime}>{new Date(ev.start).toLocaleString()}</div>
              <div className={styles.listTitle}>{ev.title}</div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>{editing ? 'Edytuj rezerwację' : 'Nowa rezerwacja'}</h3>
            <label>Temat<input value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} /></label>
            <label>Start<input type="datetime-local" value={form.start} onChange={(e)=>setForm({...form, start: e.target.value})} /></label>
            <label>End<input type="datetime-local" value={form.end} onChange={(e)=>setForm({...form, end: e.target.value})} /></label>
            <label>Opis<textarea value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} /></label>
            <label>Uczestnicy (oddziel przecinkiem)<input value={form.attendees} onChange={(e)=>setForm({...form, attendees: e.target.value})} /></label>

            <div className={styles.modalActions}>
              <button onClick={()=>setShowModal(false)}>Anuluj</button>
              {editing && <button className={styles.deleteBtn} onClick={()=>editing && deleteEvent(editing.id)}>Usuń</button>}
              <button className={styles.saveBtn} onClick={saveForm}>Zapisz</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingCalendarPage
