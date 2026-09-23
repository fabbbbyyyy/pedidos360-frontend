import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from '@/core/auth/RequireAuth';
import { RequireRole } from '@/core/auth/RequireRole';
import { LoginPage } from '@/features/auth';
import { CenteredMessage } from '@/design-system/templates';
import ProtectedLayout from '../layout/ProtectedLayout';
import { modules } from '../modules';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Guard de AUTENTICACIÓN: todo lo de adentro exige sesión */}
      <Route element={<RequireAuth />}>
        <Route element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Guard de AUTORIZACIÓN por módulo, generado desde el registro */}
          {modules.map(({ id, path, roles, Page }) => (
            <Route key={id} element={<RequireRole roles={roles} />}>
              <Route path={path} element={<Page />} />
            </Route>
          ))}

          <Route path="*" element={<CenteredMessage title="Página no encontrada" />} />
        </Route>
      </Route>
    </Routes>
  );
}
