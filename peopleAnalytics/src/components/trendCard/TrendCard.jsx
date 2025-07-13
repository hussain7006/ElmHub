import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import { constants } from "../../constants/constantsV3";

import Trend from 'react-trend';
import { useTranslation } from "react-i18next";
import { formatNumberForLocale } from "../../utils/utils";
import { useSelector } from "react-redux";

const CardContentNoPadding = styled(CardContent)(`
    padding: 0;
    display:flex;
    justify-content: center;
    align-items: center;
    &:last-child {
    padding-bottom: 0;
    }
`);

export default function TrendCard(props) {
    let { trendCardData, cameraIndex, noCharts, colors } = props;
    const { t } = useTranslation();

    let langReducer = useSelector((data) => data.lang)
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
                padding: 10,
                position: "relative"
            }}>
                <div style={{ width: "50%", paddingLeft: "0px" }}>

                    <div style={{ fontSize: noCharts ? 15 : 20, fontWeight: "bold", color: colors?.textPrimary }}>{t(constants.trendCardTitle1.replaceAll(" ", "-").toLowerCase()).toUpperCase()}</div>
                    <div style={{ fontSize: noCharts ? 12 : 14 }}>{t(constants.trendCardTitle2.replaceAll(" ", "-").toLowerCase())}</div>
                    <div
                        className={`trendCardCountDiv ${langReducer == "ar" ? 'trendCardCountDivAr' : 'trendCardCountDivAr'}`}
                        style={{ fontSize: noCharts ? "2vw" : "3.5vw", fontWeight: 500, textAlign: "center", color: colors?.textPrimary }}>
                        {
                            ((cameraIndex == 0) || (cameraIndex == 1)) ?
                                formatNumberForLocale(trendCardData.lastHourCount)
                                // formatNumberForLocale(22)
                                :
                                formatNumberForLocale(0)
                        }
                    </div>
                </div>
                <div style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Trend
                        smooth
                        autoDraw
                        autoDrawDuration={1000}
                        autoDrawEasing="ease-out"
                        data={
                            ((cameraIndex == 0) || (cameraIndex == 1)) ?
                                (trendCardData.counts.length) > 0
                                    ?
                                    (trendCardData.counts.length == 1)
                                        ?
                                        ([1, 1])
                                        :
                                        (trendCardData.counts)
                                    :
                                    ([1, 1])
                                : [1, 1]
                            // ([0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 11])
                        }
                        gradient={
                            (trendCardData.slope >= 0)
                                ?
                                [colors?.accent, colors?.accent]
                                :
                                [colors?.accent, colors?.accent]
                        }
                        radius={10}
                        strokeWidth={9.5}
                        strokeLinecap={'round'}
                    />
                </div>

            </div>
        </Card >
    );
}

