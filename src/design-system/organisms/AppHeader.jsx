import { NavLink } from 'react-router-dom';
import { Avatar, Button, IconLogout, LogoMark } from '../atoms';
import styles from './AppHeader.module.css';

export function AppHeader({ items, user, onLogout }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <LogoMark />
        <div><b>Pedidos360</b><span>Compra simple, pedidos claros</span></div>
      </div>
      <nav className={styles.nav} aria-label="Principal">
        {items.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} className={styles.navItem}>
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className={styles.account}>
        <Avatar initials={user.initials} />
        <div className={styles.user}><b>{user.name}</b><span>{user.email}</span></div>
        <Button variant="ghost" aria-label="Cerrar sesión" title="Cerrar sesión" onClick={onLogout}><IconLogout /></Button>
      </div>
    </header>
  );
}
