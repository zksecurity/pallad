import { useNavigate } from 'react-router-dom'

import { useAccount } from '@/common/hooks/useAccount'
import { useBlockchainSummary } from '@/common/hooks/useBlockchainSummary'
import { truncateString } from '@/common/lib/string'
import { ButtonArrow } from '@/components/button-arrow'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getAccountUrl } from '@/lib/explorer'

import { AppLayout } from '../../common/components/AppLayout'
import { MetaField } from '../../common/components/MetaField'
import { ViewHeading } from '../../common/components/ViewHeading'

export const StakingOverviewView = () => {
  const { data: blockchainSummary, isLoading: blockchainSummaryLoading } =
    useBlockchainSummary()
  const navigate = useNavigate()
  const { stakeDelegated, accountInfo, network } = useAccount()
  const currentSlot = `${blockchainSummary?.slot}/7140`
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading
          title="Staking"
          button={
            stakeDelegated && {
              label: 'Change Pool',
              onClick: () => navigate('/staking/delegate')
            }
          }
        />
        <div className="flex flex-col flex-1 gap-4 p-4">
          {blockchainSummaryLoading ? (
            <Skeleton className="h-[52px]" />
          ) : (
            <Card className="grid grid-cols-2 p-4 gap-2 rounded-[1rem]">
              <MetaField label="Epoch" value={blockchainSummary?.epoch} />
              <MetaField label="Slot" value={currentSlot} />
            </Card>
          )}
          {stakeDelegated ? (
            <div className="flex flex-col flex-1">
              <ViewHeading title="Delegation Info" noHorizontalPadding />
              <div className="flex flex-col gap-4">
                <MetaField
                  label="Block Producer"
                  value={truncateString({
                    value: accountInfo.delegate,
                    endCharCount: 8,
                    firstCharCount: 8
                  })}
                  url={getAccountUrl({
                    network,
                    publicKey: accountInfo.delegate
                  })}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1">
              <div className="flex-1" />
              <Button
                onClick={() => navigate('/staking/delegate')}
                className="group gap-2"
              >
                <span>Start Staking</span>
                <ButtonArrow />
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
