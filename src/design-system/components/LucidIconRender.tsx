import { lucid_icons } from "@/utils";

type Props = {
    iconName: any;
    parentClassName?: string;
    iconClassName?: string;
    iconSize?: string | number;
    text?:string
};
export function LucidIconRender({
    iconName,
    parentClassName,
    iconClassName,
    iconSize,
    text
}: Props) {
    const Icon = lucid_icons[iconName as keyof typeof lucid_icons];
    return Icon ? (
        <div className={parentClassName}>
            <Icon size={iconSize} className={iconClassName} />
            {text}
        </div>
    ) : null;
}

