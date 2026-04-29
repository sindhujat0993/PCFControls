import * as React from 'react';
import { Image, Text, Tooltip, Button, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { Dismiss16Regular, Search16Regular } from "@fluentui/react-icons";

const useStyles = (params: { chipItemWidth: string }) =>
    makeStyles({
    row: {
        display: "flex",
        alignItems: "flex-start",
        gap: "65px",
        width: "100%",
        ...shorthands.padding("4px", "0"),
        "@media (max-width: 250px)": {
            flexDirection: "column",
            alignItems: "stretch",
        },
    },

    label: {
        flexShrink: 0,
        minWidth: "120px", 
    },

    control: {
        flexGrow: 1,
        minWidth: 0,
        width: "100%"
    },
    container: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        columnGap: '5px',
        rowGap: '4px',
        alignItems: 'start',
        width: '100%',
        boxSizing: 'border-box',
        ...shorthands.padding("4px", "4px", "2px", "4px"),//('4px', '4px'),
        borderRadius: tokens.borderRadiusMedium,
        backgroundColor: tokens.colorNeutralBackground3,
        overflow: "visible",
        "@media (max-width: 250px)": {
            gridTemplateColumns: "1fr", // stack vertically
        },
    },

    chipList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignContent: 'flex-start',
        minWidth: 0,
    },
    chip: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        ...shorthands.padding('2px', '4px'),
        backgroundColor: "#E9F3FF",
        transition: "background-color 0.2s ease",
        borderRadius: tokens.borderRadiusMedium,
        minWidth: 0,
        maxWidth: params.chipItemWidth,
        ":hover": {
            backgroundColor: "#D6EAFF",
        }
    },
    chipImage: {
        borderRadius: tokens.borderRadiusCircular,
        color: tokens.colorBrandForegroundLink
    },
    chipText: {
        fontSize: tokens.fontSizeBase200,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        color: tokens.colorBrandForegroundLink,
        textDecorationLine: "underline",
        cursor: "pointer",
        minWidth: 0
    },
    customTooltip: {
        backgroundColor: "#FFFFFF",              
        color: "#000000",                       
        border: "1px solid #000000",             
        borderRadius: tokens.borderRadiusMedium,
        padding: "4px 8px",
        boxShadow: tokens.shadow16,              
        maxWidth: "250px",
        whiteSpace: "normal",
    },
    searchButton: {
        alignSelf: 'start',
        transform: "scaleX(-1)"
    },
    chipButton:{
        color: tokens.colorBrandForegroundLink
    }
})();

export interface OneToManyRelationshipMetadata {
    SchemaName: string;
    ReferencingEntityNavigationPropertyName: string;
}

export interface IMultiSelectLookupProps {
    items: ChipItem[];
    labelText: string | null;
    chipItemWidth: string;
    onRemoveItem: (id: ChipItem["id"]) => void;
    onSearch: () => void;
    onChipClick?: (id: ChipItem["id"]) => void;
}
export interface ChipItem {
    id: string | number;
    name: string;
    image?: string;
}

export const MultiSelectLookup: React.FC<IMultiSelectLookupProps> = ({
    items, labelText, chipItemWidth, onRemoveItem, onSearch,
            onChipClick }) => {
    const styles = useStyles({ chipItemWidth }); 
    return (
        <div className={styles.row}>
        {labelText && (
            <div className={styles.label}>
              {labelText}
            </div>
        )}
            <div className={styles.control}>
                <div className={styles.container}>
                    <div className={styles.chipList}>
                        {items.map(item => (
                            <div key={item.id} className={styles.chip}>
                                {item.image && (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={14}
                                        height={14}
                                        className={styles.chipImage}
                                    />
                                )}
                                <Tooltip content={
                                    <div className={styles.customTooltip}>
                                        {item.name}
                                    </div>
                                } relationship="description" withArrow>
                                    <Text
                                        className={styles.chipText}
                                        onClick={() => onChipClick?.(item.id)}
                                    >
                                        {item.name}
                                    </Text>
                                </Tooltip>

                                <Button
                                    appearance="subtle"
                                    size="small"
                                    icon={<Dismiss16Regular />}
                                    aria-label={`Remove ${item.name}`}
                                    onClick={() => onRemoveItem(item.id)}
                                    className={styles.chipButton}
                                />
                            </div>
                        ))}
                    </div>
                    <Button
                        appearance="transparent"
                        icon={<Search16Regular />}
                        aria-label="Search"
                        onClick={onSearch}
                        className={styles.searchButton}
                    />
                </div>
            </div>
        </div>
    )
}
