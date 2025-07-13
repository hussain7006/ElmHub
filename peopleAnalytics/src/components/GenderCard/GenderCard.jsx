
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
// import { Typography } from "@mui/material";
// import { constants } from "../../constants/constantsV3";
import { useTranslation } from "react-i18next";
import { formatNumberForLocale } from "../../utils/utils";
import { useSelector } from "react-redux";
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const CardContentNoPadding = styled(CardContent)(`
    padding: 0;
    display:flex;
    justify-content: center;
    align-items: center;
    &:last-child {
    padding-bottom: 0;
    }
`);

function GenderCard(props) {
    let { heading, imgSrc, imgSrcRight, imgSrcLeft, rightText, leftText, conditionText, value, imgLeftWidth, imgRightWidth, type, noCharts, textSizeClassName, colors } = props;
    const { t } = useTranslation();
    let langReducer = useSelector((data) => data.lang)
    let arabicFont = useSelector((data) => data.arabicFont)
    let englishFont = useSelector((data) => data.englishFont)

    React.useEffect(() => { }, [noCharts])
    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                width: "100%",
                margin: "0px",
                borderRadius: "15px"
            }}
        >
            <div style={{
                width: '100%',
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: noCharts ? "0px" : "10px",
            }}>
                <div>
                    {
                        conditionText == "total" ?
                            <div style={{ display: "flex", justifyContent: "space-around" }}>
                                {type == "img" ?
                                    <img src={imgSrc} style={{ textAlign: "center", objectFit: "cover" }} className={`${imgLeftWidth}`} />
                                    : imgSrc
                                }
                            </div>
                            :
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                                <img src={imgSrcLeft} className={`${imgLeftWidth}`} style={{ objectFit: "cover" }} />
                                <img src={imgSrcRight} className={`${imgRightWidth}`} style={{ objectFit: "cover" }} />
                            </div>

                    }
                </div>
                <div className="gender-text" style={{ width: "100%" }}>
                    <div className={textSizeClassName} style={{ fontFamily: langReducer == "ar" ? arabicFont : englishFont, color: colors?.textPrimary }}>
                        {t(heading.replaceAll(" ", "-").toLowerCase()).toUpperCase()}
                    </div>
                    <span
                        style={{ width: "100%", fontSize: noCharts ? 18 : 30, margin: 0 }}
                    >
                        {
                            conditionText == "total" ?
                                <div>
                                    <p style={{ textAlign: "center", justifyContent: "center", fontWeight: "bold", color: colors?.textPrimary }}> {formatNumberForLocale(value)}</p>
                                </div>
                                :
                                <>
                                    <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
                                        <span style={{ fontWeight: "bold", color: "#942D98" }}> {isNaN(leftText) ? formatNumberForLocale(0) : (formatNumberForLocale(leftText))} </span>
                                        <span style={{ fontWeight: "bold", color: "#942D98" }}> {isNaN(rightText) ? formatNumberForLocale(0) : (formatNumberForLocale(rightText))} </span>
                                    </div>
                                </>

                        }
                    </span>
                </div>
            </div>
        </Card>
    );
}

export default GenderCard;