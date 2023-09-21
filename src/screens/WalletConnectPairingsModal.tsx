/*
Copyright 2018 - 2022 The Alephium Authors
This file is part of the alephium project.

The library is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with the library. If not, see <http://www.gnu.org/licenses/>.
*/

import { useEffect } from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'

import Button from '~/components/buttons/Button'
import { ModalContent, ModalContentProps } from '~/components/layout/ModalContent'
import { BottomModalScreenTitle, ScreenSection } from '~/components/layout/Screen'
import ListItem from '~/components/ListItem'
import { useWalletConnectContext } from '~/contexts/walletConnect/WalletConnectContext'

const WalletConnectPairingsModal = ({ onClose, ...props }: ModalContentProps) => {
  const { unpairFromDapp, walletConnectClient, activeSessions } = useWalletConnectContext()

  useEffect(() => {
    if (!walletConnectClient || activeSessions.length === 0) {
      onClose && onClose()
    }
  }, [activeSessions.length, onClose, walletConnectClient])

  const handleDisconnectPress = async (pairingTopic: string) => {
    await unpairFromDapp(pairingTopic)
  }

  return (
    <ModalContent verticalGap {...props}>
      <ScreenSection>
        <BottomModalScreenTitle>Current connections</BottomModalScreenTitle>
      </ScreenSection>
      <ScreenSection>
        {activeSessions.map(({ topic, peer: { metadata } }, index) => (
          <ListItem
            key={topic}
            title={metadata.name}
            subtitle={metadata.description}
            isLast={index === activeSessions.length - 1}
            icon={metadata.icons[0] ? <DAppIcon source={{ uri: metadata.icons[0] }} /> : undefined}
            rightSideContent={
              <Button
                onPress={() => handleDisconnectPress(topic)}
                iconProps={{ name: 'remove-circle' }}
                type="transparent"
              />
            }
          />
        ))}
      </ScreenSection>
    </ModalContent>
  )
}

export default WalletConnectPairingsModal

const DAppIcon = styled(Image)`
  width: 50px;
  height: 50px;
`