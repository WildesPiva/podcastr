import { createContext, ReactNode, useContext, useState } from 'react'

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayerState: () => void;
  setPlayingState: (value: boolean) => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

type PlayContextProviderProps = {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export const PlayerContextProvider = ({ children }: PlayContextProviderProps) => {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  function setPlayingState(value: boolean) {

    setIsPlaying(value)

  }

  function play(episode: Episode) {

    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)

  }

  function playList(list: Episode[], index: number) {

    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)

  }

  function togglePlay() {

    setIsPlaying(!isPlaying)

  }

  function toggleLoop() {

    setIsLooping(!isLooping)

  }

  function toggleShuffle() {

    setIsShuffling(!isShuffling)

  }

  const hasPrevious = currentEpisodeIndex > 0

  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

  function playNext() {
    if (isShuffling) {

      const nextRandomEpisideIndex = Math.floor(Math.random() * episodeList.length)

      setCurrentEpisodeIndex(nextRandomEpisideIndex)

    } else if (hasNext) {

      setCurrentEpisodeIndex(currentEpisodeIndex + 1)

    }

  }

  function playPrevious() {

    if (hasPrevious) {

      setCurrentEpisodeIndex(currentEpisodeIndex - 1)

    }

  }

  function clearPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      play,
      playList,
      playNext,
      playPrevious,
      clearPlayerState,
      isPlaying,
      isLooping,
      isShuffling,
      togglePlay,
      toggleLoop,
      toggleShuffle,
      setPlayingState,
      hasPrevious,
      hasNext,
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}
