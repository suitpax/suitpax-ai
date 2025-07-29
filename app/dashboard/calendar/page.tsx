"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Plus, Plane, Hotel, Users, Clock, MapPin, Video } from "lucide-react"
import { format, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import toast from "react-hot-toast"

interface CalendarEvent {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  type: "flight" | "hotel" | "meeting" | "conference" | "other"
  location?: string
  attendees?: string[]
  status: "confirmed" | "pending" | "cancelled"
  created_at: string
}

interface EventForm {
  title: string
  description: string
  start_date: Date | undefined
  end_date: Date | undefined
  type: "flight" | "hotel" | "meeting" | "conference" | "other"
  location: string
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [eventForm, setEventForm] = useState<EventForm>({
    title: "",
    description: "",
    start_date: undefined,
    end_date: undefined,
    type: "meeting",
    location: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchUser()
    fetchEvents()
  }, [])

  const fetchUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session) {
      const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()
      setUser(userData)
    }
  }

  const fetchEvents = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Sample events - in a real app, fetch from database
        const sampleEvents: CalendarEvent[] = [
          {
            id: "1",
            title: "Vuelo a Madrid",
            description: "Vuelo IB3201 - Salida 08:30",
            start_date: "2025-01-25T08:30:00Z",
            end_date: "2025-01-25T10:15:00Z",
            type: "flight",
            location: "Madrid, España",
            status: "confirmed",
            created_at: "2025-01-20T10:00:00Z",
          },
          {
            id: "2",
            title: "Reunión con Cliente",
            description: "Presentación de propuesta comercial",
            start_date: "2025-01-26T14:00:00Z",
            end_date: "2025-01-26T16:00:00Z",
            type: "meeting",
            location: "Oficina Madrid",
            attendees: ["cliente@empresa.com", "manager@miempresa.com"],
            status: "confirmed",
            created_at: "2025-01-20T11:00:00Z",
          },
          {
            id: "3",
            title: "Hotel Marriott",
            description: "Check-in Hotel Marriott Madrid",
            start_date: "2025-01-25T15:00:00Z",
            end_date: "2025-01-27T12:00:00Z",
            type: "hotel",
            location: "Madrid, España",
            status: "confirmed",
            created_at: "2025-01-20T12:00:00Z",
          },
          {
            id: "4",
            title: "Conferencia Tech Summit",
            description: "Conferencia anual de tecnología",
            start_date: "2025-02-15T09:00:00Z",
            end_date: "2025-02-17T18:00:00Z",
            type: "conference",
            location: "Barcelona, España",
            status: "pending",
            created_at: "2025-01-20T13:00:00Z",
          },
        ]
        setEvents(sampleEvents)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
      toast.error("Error al cargar los eventos")
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async () => {
    if (!eventForm.title || !eventForm.start_date) {
      toast.error("Por favor, completa los campos obligatorios")
      return
    }

    setCreating(true)

    try {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventForm.title,
        description: eventForm.description,
        start_date: eventForm.start_date.toISOString(),
        end_date: eventForm.end_date?.toISOString() || eventForm.start_date.toISOString(),
        type: eventForm.type,
        location: eventForm.location,
        status: "confirmed",
        created_at: new Date().toISOString(),
      }

      setEvents((prev) => [...prev, newEvent])
      toast.success("Evento creado correctamente")
      setIsEventDialogOpen(false)
      setEventForm({
        title: "",
        description: "",
        start_date: undefined,
        end_date: undefined,
        type: "meeting",
        location: "",
      })
    } catch (error) {
      console.error("Error creating event:", error)
      toast.error("Error al crear el evento")
    } finally {
      setCreating(false)
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <Plane className="h-4 w-4 text-blue-600" />
      case "hotel":
        return <Hotel className="h-4 w-4 text-green-600" />
      case "meeting":
        return <Users className="h-4 w-4 text-purple-600" />
      case "conference":
        return <Video className="h-4 w-4 text-orange-600" />
      default:
        return <CalendarIcon className="h-4 w-4 text-gray-600" />
    }
  }

  const getEventBadge = (type: string) => {
    switch (type) {
      case "flight":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Vuelo</Badge>
      case "hotel":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Hotel</Badge>
      case "meeting":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Reunión</Badge>
      case "conference":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Conferencia</Badge>
      default:
        return <Badge variant="outline">Otro</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmado</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelado</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) =>
        isSameDay(new Date(event.start_date), date) ||
        (new Date(event.start_date) <= date && new Date(event.end_date) >= date),
    )
  }

  const selectedDateEvents = getEventsForDate(selectedDate)
  const upcomingEvents = events
    .filter((event) => new Date(event.start_date) >= new Date())
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-medium tracking-tighter">Calendario de Viajes</h1>
              <p className="text-green-100 mt-1">Organiza y planifica todos tus viajes de negocio</p>
            </div>
          </div>
          <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-green-600 hover:bg-green-50">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Evento</DialogTitle>
                <DialogDescription>Agrega un nuevo evento a tu calendario de viajes.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={eventForm.title}
                    onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Ej: Reunión con cliente"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Detalles del evento"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo *</Label>
                    <Select
                      value={eventForm.type}
                      onValueChange={(value: "flight" | "hotel" | "meeting" | "conference" | "other") =>
                        setEventForm((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Reunión</SelectItem>
                        <SelectItem value="flight">Vuelo</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="conference">Conferencia</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={eventForm.location}
                      onChange={(e) => setEventForm((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="Ciudad, país"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha de inicio *</Label>
                    <CalendarComponent
                      mode="single"
                      selected={eventForm.start_date}
                      onSelect={(date) => setEventForm((prev) => ({ ...prev, start_date: date }))}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha de fin</Label>
                    <CalendarComponent
                      mode="single"
                      selected={eventForm.end_date}
                      onSelect={(date) => setEventForm((prev) => ({ ...prev, end_date: date }))}
                      disabled={(date) => date < (eventForm.start_date || new Date())}
                      className="rounded-md border"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={createEvent} disabled={creating}>
                    {creating ? "Creando..." : "Crear Evento"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendario</CardTitle>
              <CardDescription>Selecciona una fecha para ver los eventos programados</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border w-full"
                modifiers={{
                  hasEvents: (date) => getEventsForDate(date).length > 0,
                }}
                modifiersStyles={{
                  hasEvents: {
                    backgroundColor: "#dbeafe",
                    color: "#1e40af",
                    fontWeight: "bold",
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Events for Selected Date */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}</CardTitle>
              <CardDescription>
                {selectedDateEvents.length} evento{selectedDateEvents.length !== 1 ? "s" : ""} programado
                {selectedDateEvents.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            {getEventBadge(event.type)}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>
                              {format(new Date(event.start_date), "HH:mm")} -{" "}
                              {format(new Date(event.end_date), "HH:mm")}
                            </span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <CalendarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No hay eventos programados</p>
                    <p className="text-xs text-gray-500 mt-1">Selecciona otra fecha o crea un nuevo evento</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Próximos Eventos</TabsTrigger>
          <TabsTrigger value="all">Todos los Eventos</TabsTrigger>
          <TabsTrigger value="flights">Vuelos</TabsTrigger>
          <TabsTrigger value="meetings">Reuniones</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium tracking-tighter">{event.title}</h3>
                          {getEventBadge(event.type)}
                          {getStatusBadge(event.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{format(new Date(event.start_date), "PPP", { locale: es })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {format(new Date(event.start_date), "HH:mm")} -{" "}
                              {format(new Date(event.end_date), "HH:mm")}
                            </span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-700 mb-2">No hay eventos próximos</h3>
                <p className="text-sm text-gray-500 mb-4">Crea tu primer evento para comenzar a organizar tus viajes</p>
                <Button onClick={() => setIsEventDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Evento
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all">
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium tracking-tighter">{event.title}</h3>
                          {getEventBadge(event.type)}
                          {getStatusBadge(event.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{format(new Date(event.start_date), "PPP", { locale: es })}</span>
                          <span>•</span>
                          <span>
                            {format(new Date(event.start_date), "HH:mm")} - {format(new Date(event.end_date), "HH:mm")}
                          </span>
                          {event.location && (
                            <>
                              <span>•</span>
                              <span>{event.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="flights">
          <div className="space-y-4">
            {events
              .filter((e) => e.type === "flight")
              .map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                          <Plane className="h-6 w-6 text-blue-700" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium tracking-tighter">{event.title}</h3>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">Vuelo</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{format(new Date(event.start_date), "PPP", { locale: es })}</span>
                            <span>•</span>
                            <span>{format(new Date(event.start_date), "HH:mm")}</span>
                            <span>•</span>
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="meetings">
          <div className="space-y-4">
            {events
              .filter((e) => e.type === "meeting")
              .map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                          <Users className="h-6 w-6 text-purple-700" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium tracking-tighter">{event.title}</h3>
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200">Reunión</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{format(new Date(event.start_date), "PPP", { locale: es })}</span>
                            <span>•</span>
                            <span>
                              {format(new Date(event.start_date), "HH:mm")} -{" "}
                              {format(new Date(event.end_date), "HH:mm")}
                            </span>
                            {event.location && (
                              <>
                                <span>•</span>
                                <span>{event.location}</span>
                              </>
                            )}
                          </div>
                          {event.attendees && event.attendees.length > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              <Users className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {event.attendees.length} asistente{event.attendees.length > 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
