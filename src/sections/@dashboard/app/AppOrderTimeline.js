// @mui
import PropTypes from "prop-types";
import { Card, Typography, CardHeader, CardContent } from "@mui/material";
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector } from "@mui/lab";
// utils
import { fDateTime } from "../../../utils/formatTime";

// ----------------------------------------------------------------------

AppOrderTimeline.propTypes = {
    title: PropTypes.string,
    subheader: PropTypes.string,
    list: PropTypes.array.isRequired,
};

export default function AppOrderTimeline({ title, subheader, list, ...other }) {
    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />

            <CardContent
                sx={{
                    "& .MuiTimelineItem-missingOppositeContent:before": {
                        display: "none",
                    },
                }}
            >
                <Timeline>
                    {list.map((item, index) => (
                        <OrderItem key={index} item={item} isLast={index === list.length - 1} />
                    ))}
                </Timeline>
            </CardContent>
        </Card>
    );
}

// ----------------------------------------------------------------------

OrderItem.propTypes = {
    isLast: PropTypes.bool,
    // item: PropTypes.shape({
    //     time: PropTypes.instanceOf(Date),
    //     title: PropTypes.string,
    //     type: PropTypes.string,
    // }),
};

function OrderItem({ item, isLast }) {
    const { type, title, time } = item;
    return (
        <TimelineItem>
            <TimelineSeparator>
                <TimelineDot
                    color={(type === 0 && "primary") || (type === 1 && "success") || (type === 2 && "info") || (type === 3 && "warning") || "error"}
                />
                {isLast ? null : <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
                <Typography variant="subtitle2">{title}</Typography>

                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {fDateTime(time)}
                </Typography>
            </TimelineContent>
        </TimelineItem>
    );
}
