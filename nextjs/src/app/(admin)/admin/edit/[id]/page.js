import ArticleEditor from '@/components/ArticleEditor';

export default function EditArticlePage({ params }) {
    return <ArticleEditor articleId={params.id} />; 
}