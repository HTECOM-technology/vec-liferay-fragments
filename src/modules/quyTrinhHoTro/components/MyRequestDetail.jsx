import React from "react";
import PropTypes from "prop-types";
import SupportRequestDetail from "./SupportRequestDetail";

function MyRequestDetail({ record, onBack, onStatusChange }) {
    const handleRecordUpdated = (updatedRecord) => {
        onStatusChange(updatedRecord.requestId, updatedRecord.status);
    };

    return (
        <SupportRequestDetail
            requestId={Number(record.requestId || record.id)}
            onBack={onBack}
            onRecordUpdated={handleRecordUpdated}
        />
    );
}

MyRequestDetail.propTypes = {
    record: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        requestId: PropTypes.number,
    }).isRequired,
    onBack: PropTypes.func,
    onStatusChange: PropTypes.func,
};

MyRequestDetail.defaultProps = {
    onBack: () => {},
    onStatusChange: () => {},
};

export default MyRequestDetail;
