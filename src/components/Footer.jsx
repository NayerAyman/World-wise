import styles from "./Footer.module.css"

function Footer() {
  return (
      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; CopyRight {new Date().getFullYear()} by Nayer Ayman.
        </p>
      </footer>
  )
}

export default Footer
