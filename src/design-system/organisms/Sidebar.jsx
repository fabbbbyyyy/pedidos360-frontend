import { NavLink } from 'react-router-dom';
import { Avatar, Button, IconLogout, LogoMark } from '../atoms';
import styles from './Sidebar.module.css';

// items: [{ path, label, icon }]  — el menú lo arma la app desde el registro de módulos.
export function Sidebar({ items, user, onLogout }) {
  return (
    <aside className={styles.rail}>
      <div className={styles.brand}>
        <LogoMark />
        <div>
          <b>Pedidos360</b>
          <span className={styles.brandSub}>Operación</span>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Principal">
        {items.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} className={styles.navItem}>
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.foot}>
        <div className={styles.who}>
          <Avatar initials={user.initials} />
          <span className={styles.whoTxt}>
            <b>{user.name}</b>
            <span>{user.email}</span>
          </span>
          <Button variant="ghost" aria-label="Cerrar sesión" title="Cerrar sesión" onClick={onLogout}>
            <IconLogout />
          </Button>
        </div>
      </div>
    </aside>
  );
}
