import { Avatar as AntdAvatar, AvatarProps } from 'antd'

type Props = AvatarProps & {
    name: string;

}

const CustomAvatar = ({ name, style, ...rest }: Props) => {
    return (
        <AntdAvatar
            alt={'Bruno Nicolai'}
            size="small"
            style={{ 
                backgroundColor: '#291700',
                display: 'flex',
                alignItems: 'center',
                border: 'none',
            }}
        >
            {name}
        </AntdAvatar>
  )
}

export default CustomAvatar