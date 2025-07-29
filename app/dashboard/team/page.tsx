"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Plus, Mail, Phone, Building, Shield, UserCheck, Trash2, Crown, User } from "lucide-react"
import toast from "react-hot-toast"

interface TeamMember {
  id: string
  full_name: string
  email: string
  role: "admin" | "manager" | "member"
  department: string
  phone?: string
  status: "active" | "inactive" | "pending"
  created_at: string
  last_login?: string
}

interface InviteForm {
  email: string
  full_name: string
  role: "admin" | "manager" | "member"
  department: string
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [inviteForm, setInviteForm] = useState<InviteForm>({
    email: "",
    full_name: "",
    role: "member",
    department: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchUser()
    fetchTeamMembers()
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

  const fetchTeamMembers = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // In a real app, you'd fetch team members based on organization
        // For now, we'll show sample data
        const sampleMembers: TeamMember[] = [
          {
            id: "1",
            full_name: "Ana García",
            email: "ana.garcia@empresa.com",
            role: "admin",
            department: "IT",
            phone: "+34 600 123 456",
            status: "active",
            created_at: "2024-01-15T10:00:00Z",
            last_login: "2024-01-20T14:30:00Z",
          },
          {
            id: "2",
            full_name: "Carlos Rodríguez",
            email: "carlos.rodriguez@empresa.com",
            role: "manager",
            department: "Ventas",
            phone: "+34 600 789 012",
            status: "active",
            created_at: "2024-01-10T09:00:00Z",
            last_login: "2024-01-19T16:45:00Z",
          },
          {
            id: "3",
            full_name: "María López",
            email: "maria.lopez@empresa.com",
            role: "member",
            department: "Marketing",
            status: "pending",
            created_at: "2024-01-18T11:00:00Z",
          },
        ]
        setTeamMembers(sampleMembers)
      }
    } catch (error) {
      console.error("Error fetching team members:", error)
      toast.error("Error al cargar el equipo")
    } finally {
      setLoading(false)
    }
  }

  const inviteTeamMember = async () => {
    if (!inviteForm.email || !inviteForm.full_name || !inviteForm.department) {
      toast.error("Por favor, completa todos los campos obligatorios")
      return
    }

    setInviting(true)

    try {
      // In a real app, you'd send an invitation email and create a pending user record
      const newMember: TeamMember = {
        id: Date.now().toString(),
        full_name: inviteForm.full_name,
        email: inviteForm.email,
        role: inviteForm.role,
        department: inviteForm.department,
        status: "pending",
        created_at: new Date().toISOString(),
      }

      setTeamMembers((prev) => [...prev, newMember])
      toast.success("Invitación enviada correctamente")
      setIsInviteDialogOpen(false)
      setInviteForm({
        email: "",
        full_name: "",
        role: "member",
        department: "",
      })
    } catch (error) {
      console.error("Error inviting team member:", error)
      toast.error("Error al enviar la invitación")
    } finally {
      setInviting(false)
    }
  }

  const updateMemberRole = async (memberId: string, newRole: "admin" | "manager" | "member") => {
    try {
      setTeamMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, role: newRole } : member)))
      toast.success("Rol actualizado correctamente")
    } catch (error) {
      console.error("Error updating role:", error)
      toast.error("Error al actualizar el rol")
    }
  }

  const removeMember = async (memberId: string) => {
    try {
      setTeamMembers((prev) => prev.filter((member) => member.id !== memberId))
      toast.success("Miembro eliminado del equipo")
    } catch (error) {
      console.error("Error removing member:", error)
      toast.error("Error al eliminar el miembro")
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-600" />
      case "manager":
        return <Shield className="h-4 w-4 text-blue-600" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Administrador</Badge>
      case "manager":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Manager</Badge>
      default:
        return <Badge variant="outline">Miembro</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Activo</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Inactivo</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const activeMembers = teamMembers.filter((m) => m.status === "active").length
  const pendingInvites = teamMembers.filter((m) => m.status === "pending").length
  const totalMembers = teamMembers.length

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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-medium tracking-tighter">Gestión de Equipo</h1>
              <p className="text-blue-100 mt-1">Administra los miembros de tu equipo y sus permisos</p>
            </div>
          </div>
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                <Plus className="mr-2 h-4 w-4" />
                Invitar Miembro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Invitar Nuevo Miembro</DialogTitle>
                <DialogDescription>Envía una invitación para que se una a tu equipo de viajes.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nombre completo *</Label>
                    <Input
                      id="full_name"
                      value={inviteForm.full_name}
                      onChange={(e) => setInviteForm((prev) => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Ej: Ana García"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email corporativo *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="ana@empresa.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol *</Label>
                    <Select
                      value={inviteForm.role}
                      onValueChange={(value: "admin" | "manager" | "member") =>
                        setInviteForm((prev) => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Miembro</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento *</Label>
                    <Select
                      value={inviteForm.department}
                      onValueChange={(value) => setInviteForm((prev) => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Ventas">Ventas</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="RRHH">RRHH</SelectItem>
                        <SelectItem value="Finanzas">Finanzas</SelectItem>
                        <SelectItem value="Operaciones">Operaciones</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Permisos del rol seleccionado:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {inviteForm.role === "admin" && (
                      <>
                        <li>• Gestión completa del equipo</li>
                        <li>• Acceso a todos los reportes</li>
                        <li>• Configuración de políticas</li>
                        <li>• Aprobación de gastos</li>
                      </>
                    )}
                    {inviteForm.role === "manager" && (
                      <>
                        <li>• Gestión de su departamento</li>
                        <li>• Aprobación de gastos del equipo</li>
                        <li>• Reportes departamentales</li>
                      </>
                    )}
                    {inviteForm.role === "member" && (
                      <>
                        <li>• Gestión de gastos personales</li>
                        <li>• Reserva de viajes</li>
                        <li>• Reportes personales</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={inviteTeamMember} disabled={inviting}>
                    {inviting ? "Enviando..." : "Enviar Invitación"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Miembros</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">{totalMembers}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Miembros Activos</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">{activeMembers}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Invitaciones Pendientes</p>
                <p className="text-2xl font-medium tracking-tighter mt-1">{pendingInvites}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                <Mail className="h-5 w-5 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Todos ({totalMembers})</TabsTrigger>
          <TabsTrigger value="active">Activos ({activeMembers})</TabsTrigger>
          <TabsTrigger value="pending">Pendientes ({pendingInvites})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-700">
                          {member.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium tracking-tighter">{member.full_name}</h3>
                          {getRoleIcon(member.role)}
                          {getRoleBadge(member.role)}
                          {getStatusBadge(member.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{member.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            <span>{member.department}</span>
                          </div>
                          {member.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                        </div>
                        {member.last_login && (
                          <p className="text-xs text-gray-500 mt-1">
                            Último acceso: {new Date(member.last_login).toLocaleDateString("es-ES")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={member.role}
                        onValueChange={(value: "admin" | "manager" | "member") => updateMemberRole(member.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Miembro</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMember(member.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-700 mb-2">No hay miembros en el equipo</h3>
                <p className="text-sm text-gray-500 mb-4">Comienza invitando a tus compañeros de trabajo</p>
                <Button onClick={() => setIsInviteDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Invitar Primer Miembro
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active">
          <div className="space-y-4">
            {teamMembers
              .filter((m) => m.status === "active")
              .map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <UserCheck className="h-6 w-6 text-green-700" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium tracking-tighter">{member.full_name}</h3>
                            {getRoleBadge(member.role)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{member.email}</span>
                            <span>•</span>
                            <span>{member.department}</span>
                          </div>
                          {member.last_login && (
                            <p className="text-xs text-gray-500 mt-1">
                              Último acceso: {new Date(member.last_login).toLocaleDateString("es-ES")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="space-y-4">
            {teamMembers
              .filter((m) => m.status === "pending")
              .map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Mail className="h-6 w-6 text-yellow-700" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium tracking-tighter">{member.full_name}</h3>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{member.email}</span>
                            <span>•</span>
                            <span>{member.department}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Invitado el {new Date(member.created_at).toLocaleDateString("es-ES")}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Reenviar Invitación
                      </Button>
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
