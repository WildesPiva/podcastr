import Link from 'next/link'
import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'
import { BsBrightnessLow } from 'react-icons/bs'
import { TiWeatherNight } from 'react-icons/ti'

import { useGlobal } from '../../contexts/GlobalContext'

import styles from './styles.module.scss'

export function Header() {
  const { isDarkTheme, handleChangeTheme } = useGlobal()

  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR
  })

  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <a><img src="/logo.svg" alt="Podcastr" /></a>
      </Link>

      <p>O melhor para você ouvir, sempre</p>

      <span>{currentDate}</span>

      <button onClick={handleChangeTheme}>
        {isDarkTheme ? <TiWeatherNight /> : <BsBrightnessLow />}
      </button>
    </header>
  )
}