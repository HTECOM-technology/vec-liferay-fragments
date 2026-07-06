import React from "react";
import { useEffect, useState } from "react";
import { getQuickLinks } from "../../../../services/quickLinksService";
import { IconItem1, IconItem2, IconItem3, IconItem4 } from "./icons";

const IconList = [<IconItem1 />, <IconItem2 />, <IconItem3 />, <IconItem4 />];

function useQuickLinks() {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getQuickLinks()
            .then((apiItems) => {
                const data = (apiItems || []).map((item, index) => ({
                    ...item,
                    icon: IconList[index] || <IconItem1 />,
                }));
                setItems(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, []);

    return { items, loading, error };
}

export default useQuickLinks;
