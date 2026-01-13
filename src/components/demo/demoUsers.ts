// src/demo/demoUsers.ts

export type DemoUser = {
  id: string;
  label: string;
  email: string;
  role: string;
  password: string;
  description?: string;
};

export const DEMO_USERS: DemoUser[] = [
  {
    id: "admin",
    label: "Admin demo",
    email: "admin@anzaval.demo",
    password: "Demo1234",
    role: "admin",
    description: "Acceso total: dashboard, reportes, usuarios y proyectos.",
  },
  {
    id: "capturista",
    label: "Capturista 1",
    email: "capturista1@anzaval.demo",
    password: "Demo1234",
    role: "capturista",
    description: "Captura y edición de activos en proyectos asignados.",
  },

  {
    id: "capturista2",
    label: "Capturista 2",
    email: "capturista2@anzaval.demo",
    password: "Demo1234",
    role: "capturista",
    description: "Captura y edición de activos en proyectos asignados.",
  },
  {
    id: "supervisor",
    label: "Supervisor demo",
    email: "supervisor@anzaval.demo",
    password: "Demo1234",
    role: "supervisor",
    description: "Enfoque en consulta y reportes.",
  },
];
