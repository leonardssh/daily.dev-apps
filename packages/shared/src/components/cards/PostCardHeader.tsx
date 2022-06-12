import classNames from 'classnames';
import React, { ReactElement, ReactNode, useContext } from 'react';
import FeaturesContext from '../../contexts/FeaturesContext';
import OptionsButton from '../buttons/OptionsButton';
import { CardHeader } from './Card';
import SourceButton from './SourceButton';
import { Source } from '../../graphql/sources';
import { ReadArticleButton } from './ReadArticleButton';

interface CardHeaderProps {
  children?: ReactNode;
  source: Source;
  onMenuClick?: (e: React.MouseEvent) => void;
  postLink: string;
}

export const PostCardHeader = ({
  onMenuClick,
  children,
  source,
  postLink,
}: CardHeaderProps): ReactElement => {
  const { postModalByDefault, postEngagementNonClickable } =
    useContext(FeaturesContext);

  return (
    <CardHeader>
      <SourceButton source={source} />
      {children}
      <span
        className={classNames(
          'flex flex-row ml-auto',
          (!postModalByDefault || postEngagementNonClickable) &&
            'laptop:mouse:invisible laptop:mouse:group-hover:visible',
        )}
      >
        {(postModalByDefault || postEngagementNonClickable) && (
          <ReadArticleButton className="mr-2" href={postLink} />
        )}
        <OptionsButton onClick={onMenuClick} tooltipPlacement="top" />
      </span>
    </CardHeader>
  );
};