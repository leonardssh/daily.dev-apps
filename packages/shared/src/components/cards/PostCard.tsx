import React, {
  forwardRef,
  HTMLAttributes,
  ReactElement,
  Ref,
  useContext,
} from 'react';
import classNames from 'classnames';
import { Post } from '../../graphql/posts';
import {
  Card,
  CardImage,
  CardSpace,
  CardTextContainer,
  CardTitle,
  getPostClassNames,
} from './Card';
import FeatherIcon from '../icons/Feather';
import styles from './Card.module.css';
import TrendingFlag from './TrendingFlag';
import PostLink from './PostLink';
import PostMetadata from './PostMetadata';
import ActionButtons from './ActionButtons';
import PostAuthor from './PostAuthor';
import { ProfilePicture } from '../ProfilePicture';
import { PostCardHeader } from './PostCardHeader';
import FeaturesContext from '../../contexts/FeaturesContext';

type Callback = (post: Post, e?: React.MouseEvent) => unknown;

export type PostCardProps = {
  post: Post;
  onLinkClick?: Callback;
  onUpvoteClick?: (post: Post, upvoted: boolean) => unknown;
  onCommentClick?: Callback;
  onBookmarkClick?: (post: Post, bookmarked: boolean) => unknown;
  onMenuClick?: (event: React.MouseEvent, post: Post) => unknown;
  showShare?: boolean;
  onShare?: Callback;
  openNewTab?: boolean;
  enableMenu?: boolean;
  menuOpened?: boolean;
  showImage?: boolean;
  postHeadingFont: string;
} & HTMLAttributes<HTMLDivElement>;

export const PostCard = forwardRef(function PostCard(
  {
    post,
    onLinkClick,
    onUpvoteClick,
    onCommentClick,
    onBookmarkClick,
    onMenuClick,
    showShare,
    onShare,
    openNewTab,
    enableMenu,
    menuOpened,
    className,
    children,
    showImage = true,
    style,
    postHeadingFont,
    ...props
  }: PostCardProps,
  ref: Ref<HTMLElement>,
): ReactElement {
  const { postCardVersion, postEngagementNonClickable } =
    useContext(FeaturesContext);
  const isV1 = postCardVersion === 'v1';
  const { trending } = post;
  const customStyle = !showImage ? { minHeight: '15.125rem' } : {};
  const card = (
    <Card
      {...props}
      className={getPostClassNames(post, className)}
      style={{ ...style, ...customStyle }}
      ref={ref}
    >
      <PostLink post={post} openNewTab={openNewTab} onLinkClick={onLinkClick} />
      <CardTextContainer>
        {isV1 && (
          <PostCardHeader
            source={post.source}
            onMenuClick={(event) => onMenuClick?.(event, post)}
          />
        )}
        <CardTitle className={classNames(className, postHeadingFont)}>
          {post.title}
        </CardTitle>
      </CardTextContainer>
      <CardSpace />
      <PostMetadata
        createdAt={post.createdAt}
        readTime={post.readTime}
        className="mx-4"
      />
      <div
        className={classNames(
          'flex',
          postCardVersion === 'v1' ? 'flex-col' : 'flex-col-reverse',
        )}
      >
        {!showImage && <PostAuthor post={post} className="mx-4 mt-2" />}
        {showImage && (
          <CardImage
            imgAlt="Post Cover image"
            imgSrc={post.image}
            fallbackSrc="https://res.cloudinary.com/daily-now/image/upload/f_auto/v1/placeholders/1"
            className="my-2"
          >
            {post.author && (
              <div
                className={classNames(
                  'absolute flex items-center py-2 px-3 text-theme-label-secondary bg-theme-bg-primary z-1 font-bold typo-callout w-full',
                  styles.authorBox,
                )}
              >
                <ProfilePicture size="small" user={post.author} />
                <span className="flex-1 mx-3 truncate">{post.author.name}</span>
                <FeatherIcon className="text-2xl text-theme-status-help" />
              </div>
            )}
          </CardImage>
        )}
        <ActionButtons
          post={post}
          onUpvoteClick={onUpvoteClick}
          onCommentClick={onCommentClick}
          onBookmarkClick={onBookmarkClick}
          showShare={showShare}
          onShare={onShare}
          className={classNames(
            'mx-4',
            !postEngagementNonClickable && 'justify-between',
            !showImage && 'mt-4',
          )}
        />
      </div>
      {children}
    </Card>
  );

  if (trending) {
    return (
      <div className={`relative ${styles.cardContainer}`}>
        {card}
        <TrendingFlag trending={trending} />
      </div>
    );
  }
  return card;
});
