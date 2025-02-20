import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useUsersQuery } from '@/lib/api/queries/useUsersQuery.ts'
import { Dispatch, SetStateAction, useState } from 'react'
import { LightUser } from '@shared/api.types.ts'
import { useMyUserQuery } from '@/lib/api/queries/useMyUserQuery.ts'

type Props = {
    value: LightUser | undefined
    onChange: Dispatch<SetStateAction<LightUser | undefined>>
    excludeSelf?: boolean
}
export function UserSelect({ value, onChange, excludeSelf }: Props) {
    const [open, setOpen] = useState(false)

    const { data: self } = useMyUserQuery()
    const { data: users } = useUsersQuery()

    const filteredUsers = users?.filter((user) => !excludeSelf || user._id !== self?._id)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value ? value.username : 'Select friend...'}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandList>
                        <CommandEmpty>No users found.</CommandEmpty>
                        <CommandGroup>
                            {filteredUsers &&
                                filteredUsers.map((user) => (
                                    <CommandItem
                                        key={user._id.toString()}
                                        value={user._id.toString()}
                                        onSelect={(currentValue) => {
                                            const newUser = users?.find(
                                                (user) => user._id === currentValue
                                            )
                                            onChange(newUser)
                                            setOpen(false)
                                        }}
                                    >
                                        {user.username}
                                        <Check
                                            className={cn(
                                                'ml-auto',
                                                user._id === value?._id
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
