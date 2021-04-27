import { useState } from 'react'
import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import InfiniteScroll from "react-infinite-scroll-component";

import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'
import stylesLoading from '../styles/loading.module.scss'

type Episode = {
  id: string,
  title: string,
  members: string,
  publishedAt: string,
  thumbnail: string,
  duration: Number,
  durationFormated: string,
  url: string
}

type HomeProps = {
  latestEpisodes: Array<Episode>,
  allEpisodes: Array<Episode>
  // episodes: Episode[]
}

const parse = (data) => {
  return data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationFormated: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url
    }
  })
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const [AllEpisodes, setAllEpisodes] = useState(allEpisodes)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchMoreData = async () => {
    const { data } = await api.get('episodes', {
      params: {
        _page: page + 1,
        _limit: 4,
        _sort: 'published_at',
        _order: 'desc'
      }
    })
    setHasMore(data.length !== 0)
    setPage(page + 1)
    setAllEpisodes(AllEpisodes.concat(parse(data)))
  }
  const EndMessage = () => {
    return (
      <p style={{ textAlign: 'center', marginTop: '2rem' }}>
        <b>Sem mais podcasts!</b>
      </p>
    )
  }
  const Loader = () => {
    return (
      <div className={stylesLoading.center}>
        <div className={stylesLoading.loading} />
      </div>
    )
  }

  return (
    <div className={styles.homepage} id='home'>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image
                  width={700}
                  height={160}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit={"cover"}
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationFormated}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocae episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <InfiniteScroll
          scrollableTarget="home"
          dataLength={AllEpisodes.length}
          next={fetchMoreData}
          // style={{ display: 'flex', flexDirection: 'column-reverse' }}
          hasMore={hasMore}
          endMessage={<EndMessage />}
          loader={<Loader />}
        >
          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {AllEpisodes.map(episode => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit={"cover"}
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100, textTransform: 'capitalize' }}>{episode.publishedAt}</td>
                    <td>{episode.durationFormated}</td>
                    <td>
                      <button type="button">
                        <img src="/play-green.svg" alt="Tocas episódio" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </InfiniteScroll>
      </section>
    </div>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _page: 1,
      _limit: 4,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = parse(data)

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8, // 8 hours
  }
}