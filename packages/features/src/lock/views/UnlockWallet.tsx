import { zodResolver } from '@hookform/resolvers/zod'
import { getSessionPersistence } from '@palladxyz/persistence'
import { useVault } from '@palladxyz/vault'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { passwordSchema } from '@/common/lib/validation'
import { ButtonArrow } from '@/components/button-arrow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { WizardLayout } from '../../common/components'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useAccount } from '../../common/hooks/useAccount'

const formSchema = z.object({
  spendingPassword: passwordSchema
})

export const UnlockWalletView = () => {
  const [showPassword, setShowPassword] = useState(false)
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const { restartCurrentWallet } = useAccount()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    setError
  } = useForm({
    defaultValues: {
      spendingPassword: ''
    },
    resolver: zodResolver(formSchema)
  })
  const onSubmit = async ({
    spendingPassword
  }: {
    spendingPassword: string
  }) => {
    await getSessionPersistence().setItem('spendingPassword', spendingPassword)
    await useVault.persist.rehydrate()
  }
  useEffect(() => {
    const unsub = useVault.persist.onFinishHydration(async () => {
      if (!isDirty) return
      if (!currentWallet?.accountInfo?.publicKey) {
        await getSessionPersistence().setItem('spendingPassword', '')
        return setError('spendingPassword', {
          type: 'wrongPassword',
          message: 'The spending password is wrong'
        })
      }
      navigate('/dashboard')
    })
    return () => unsub()
  })
  return (
    <WizardLayout
      footer={
        <Button
          type="submit"
          className="flex-1 group gap-2"
          form="unlockWalletForm"
          data-testid="unlockWallet__unlockButton"
        >
          <span>Unlock</span>
          <ButtonArrow />
        </Button>
      }
    >
      <div className="flex flex-col flex-1 gap-4">
        <ViewHeading
          title="Unlock Wallet"
          button={{
            label: 'Restart Wallet',
            onClick: restartCurrentWallet
          }}
        />
        <div className="flex flex-col flex-1 gap-4 p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
            id="unlockWalletForm"
          >
            <Label
              htmlFor="spendingPassword"
              className={cn(
                'cursor-pointer',
                errors.spendingPassword && 'text-destructive'
              )}
            >
              Spending Password
            </Label>
            <div className="flex gap-2">
              <Input
                id="spendingPassword"
                type={showPassword ? 'text' : 'password'}
                data-testid="unlockWallet__password"
                className={cn(errors.spendingPassword && 'border-destructive')}
                autoFocus
                {...register('spendingPassword')}
              />
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    data-testid="unlockWallet__togglePasswordVisible"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showPassword ? 'Hide password' : 'Show password'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-destructive">
              {errors.spendingPassword?.message}
            </p>
          </form>
        </div>
      </div>
    </WizardLayout>
  )
}
