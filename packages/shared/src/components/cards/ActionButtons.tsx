import React, { ReactElement, ReactNode, useContext } from 'react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import styles from './Card.module.css';
import { Post } from '../../graphql/posts';
import rem from '../../../macros/rem.macro';
import InteractionCounter from '../InteractionCounter';
import { QuaternaryButton } from '../buttons/QuaternaryButton';
import UpvoteIcon from '../icons/Upvote';
import CommentIcon from '../icons/Discuss';
import BookmarkIcon from '../icons/Bookmark';
import { Button } from '../buttons/Button';
import { SimpleTooltip } from '../tooltips/SimpleTooltip';
import FeaturesContext from '../../contexts/FeaturesContext';
import OptionsButton from '../buttons/OptionsButton';
import classed from '../../lib/classed';
import { ReadArticleButton } from './ReadArticleButton';
import { visibleOnGroupHover } from './common';

const ShareIcon = dynamic(() => import('../icons/Forward'));

export type ActionButtonsProps = {
  post: Post;
  showShare: boolean;
  onMenuClick?: (e: React.MouseEvent) => unknown;
  onUpvoteClick?: (post: Post, upvoted: boolean) => unknown;
  onCommentClick?: (post: Post) => unknown;
  onBookmarkClick?: (post: Post, bookmarked: boolean) => unknown;
  onShare?: (post: Post) => unknown;
  className?: string;
  children?: ReactNode;
  insaneMode?: boolean;
};

const getContainer = (displayWhenHovered = false, className?: string) =>
  classed(
    'div',
    classNames(
      'flex justify-between',
      displayWhenHovered && visibleOnGroupHover,
      className,
    ),
  );

export default function ActionButtons({
  post,
  showShare,
  onUpvoteClick,
  onCommentClick,
  onBookmarkClick,
  onMenuClick,
  onShare,
  className,
  children,
  insaneMode,
}: ActionButtonsProps): ReactElement {
  const { postCardVersion, postEngagementNonClickable, postModalByDefault } =
    useContext(FeaturesContext);
  const isV2 = postCardVersion === 'v2';
  const buttonStyles = postEngagementNonClickable ? {} : { width: rem(78) };
  const separatedActions =
    (insaneMode && postModalByDefault) ||
    (postModalByDefault && postEngagementNonClickable);
  const LeftContainer = separatedActions ? getContainer() : React.Fragment;
  const RightContainer = separatedActions
    ? getContainer(isV2 || (insaneMode && postModalByDefault), 'ml-auto')
    : React.Fragment;

  const bookmarkButton = (
    <SimpleTooltip content={post.bookmarked ? 'Remove bookmark' : 'Bookmark'}>
      <Button
        icon={<BookmarkIcon filled={post.bookmarked} size="medium" />}
        buttonSize="small"
        pressed={post.bookmarked}
        onClick={() => onBookmarkClick?.(post, !post.bookmarked)}
        className="btn-tertiary-bun"
      />
    </SimpleTooltip>
  );

  return (
    <div
      className={classNames(
        styles.actionButtons,
        'flex flex-row items-center',
        separatedActions && 'justify-between',
        insaneMode && isV2 && 'flex-1',
        className,
      )}
    >
      <LeftContainer>
        <SimpleTooltip
          disabled={postEngagementNonClickable}
          content={post.upvoted ? 'Remove upvote' : 'Upvote'}
        >
          <QuaternaryButton
            readOnly={postEngagementNonClickable}
            id={`post-${post.id}-upvote-btn`}
            icon={
              <UpvoteIcon
                filled={post.upvoted || postEngagementNonClickable}
                size={postEngagementNonClickable ? 'small' : 'medium'}
              />
            }
            buttonSize="small"
            pressed={post.upvoted}
            onClick={() => onUpvoteClick?.(post, !post.upvoted)}
            style={buttonStyles}
            className="btn-tertiary-avocado"
          >
            {postEngagementNonClickable && !post.numUpvotes ? null : (
              <InteractionCounter
                value={post.numUpvotes > 0 && post.numUpvotes}
              />
            )}
          </QuaternaryButton>
        </SimpleTooltip>
        <SimpleTooltip content="Comments" disabled={postEngagementNonClickable}>
          <QuaternaryButton
            readOnly={postEngagementNonClickable}
            id={`post-${post.id}-comment-btn`}
            icon={
              <CommentIcon
                filled={post.commented || postEngagementNonClickable}
                size={postEngagementNonClickable ? 'small' : 'medium'}
              />
            }
            buttonSize="small"
            pressed={post.commented}
            onClick={() => onCommentClick?.(post)}
            style={buttonStyles}
            className="btn-tertiary-avocado"
          >
            <InteractionCounter
              value={post.numComments > 0 && post.numComments}
            />
          </QuaternaryButton>
        </SimpleTooltip>
        {insaneMode &&
          postModalByDefault &&
          !postEngagementNonClickable &&
          bookmarkButton}
      </LeftContainer>
      <RightContainer>
        {insaneMode && postModalByDefault && (
          <ReadArticleButton href={post.permalink} className="btn-tertiary" />
        )}
        {(!insaneMode || !postModalByDefault || postEngagementNonClickable) &&
          bookmarkButton}
        {(isV2 || insaneMode) && (
          <OptionsButton
            className={visibleOnGroupHover}
            onClick={onMenuClick}
            tooltipPlacement="top"
          />
        )}
        {showShare && (
          <SimpleTooltip content="Share post">
            <Button
              icon={<ShareIcon />}
              buttonSize="small"
              onClick={() => onShare?.(post)}
              className="btn-tertiary"
            />
          </SimpleTooltip>
        )}
        {children}
      </RightContainer>
    </div>
  );
}
