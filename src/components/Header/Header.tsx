import styles from './Header.module.css';
import Image from 'next/image';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.icon}>
            <Image src="/logo.png" alt="Asian Food Tours Logo" width={48} height={48} />
          </div>
          <div>
            <h1 className={styles.title}>
              Your Neighborhood Asian Food Guide
            </h1>
            <p className={styles.subtitle}>
              <a href="https://www.instagram.com/asianfoodtours/" target="_blank" rel="noopener noreferrer" className={styles.instagramLink}>
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg" alt="Instagram" width="16" height="16" className={styles.instagramIcon} />@asianfoodtours
              </a>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
