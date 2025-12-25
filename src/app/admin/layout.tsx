'use client'

import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AuthGuard from '@/components/admin/AuthGuard/AuthGuard'
import styles from './admin.module.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // Don't wrap login page with AuthGuard
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <AuthGuard>
      <div className={styles.layout}>
        <nav className={styles.nav}>
          <div className={styles.navContent}>
            <h1 className={styles.title}>Asian Food Tours - Admin</h1>
            <div className={styles.links}>
              <a href="/admin" className={styles.link}>Dashboard</a>
              <a href="/admin/restaurants/new" className={styles.link}>Add Restaurant</a>
              <a href="/" className={styles.link}>View Site</a>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </nav>
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
