import useThemeStore from '../../../../store/themeStore';

export default function ElmTitle() {
    const { colors } = useThemeStore();

    return (
        < div className="w-full mb-8 flex flex-wrap gap-2.5 justify-center items-center text-3xl font-bold" >
            <span className="self-stretch my-auto"
                style={{ color: colors.textPrimary }}
            >
                Explore
            </span>
            <img
                src="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/9c903654d053a21353d017082c0cea2c64e64f3c?placeholderIfAbsent=true"
                className="object-contain shrink-0 self-stretch my-auto aspect-[2.48] w-[67px]"
                alt="Logo"
            />
            <span className="self-stretch my-auto "
                style={{ color: colors.textPrimary }}>
                's
            </span>
            <span className="self-stretch my-auto "
                style={{ color: colors.textPrimary }}>
                {" "}AI Solutions Marketplace
            </span>
        </div >
    )
}