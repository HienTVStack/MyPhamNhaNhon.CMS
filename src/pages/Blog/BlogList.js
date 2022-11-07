import { Link as RouterLink } from "react-router-dom";
// material
import { Grid, Button, Container, Stack, Typography } from "@mui/material";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from "../../sections/@dashboard/blog";
// mock
import POSTS from "../../_mock/blog";
import { useState } from "react";
import blogApi from "src/api/blogApi";
import { useEffect } from "react";
import Loading from "src/components/Loading";
import { Fragment } from "react";

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
    { value: "latest", label: "Latest" },
    { value: "popular", label: "Popular" },
    { value: "oldest", label: "Oldest" },
];

// ----------------------------------------------------------------------

export default function Blog() {
    const [loading, setLoading] = useState(false);
    const [blogList, setBlogList] = useState([]);

    const blogLoader = async () => {
        setLoading(true);
        try {
            const res = await blogApi.getAll();

            if (res.message === "OK") {
                setBlogList(res.blogs);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        blogLoader();
    }, []);

    return (
        <Page title="Dashboard: Blog">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Bài viết
                    </Typography>
                    <Button variant="contained" component={RouterLink} to="/dashboard/blog/create" startIcon={<Iconify icon="eva:plus-fill" />}>
                        Bài viết mới
                    </Button>
                </Stack>

                {loading ? (
                    <Loading />
                ) : (
                    <Fragment>
                        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
                            <BlogPostsSearch posts={blogList} />
                            <BlogPostsSort options={SORT_OPTIONS} />
                        </Stack>
                        <Grid container spacing={3}>
                            {blogList.map((post, index) => (
                                <BlogPostCard key={post.id} post={post} index={index} />
                            ))}
                        </Grid>
                    </Fragment>
                )}
            </Container>
        </Page>
    );
}
