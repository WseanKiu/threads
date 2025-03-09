'use client'
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

type Props = {
  pageNumber: number;
  isNext: boolean;
  path: string;
}

const Pagination = ({ pageNumber, isNext, path }: Props) => {
  const router = useRouter();

  const handlePagination = (direction: string) => {
    let nextPageNumber = pageNumber;

    if (direction === "prev") {
      nextPageNumber = Math.max(1, pageNumber - 1);
    } else if (direction === "next") {
      nextPageNumber = pageNumber + 1;
    }

    if (nextPageNumber > 1) {
      router.push(`/${path}?page=${nextPageNumber}`);
    } else {
      router.push(`/${path}`)
    }
  }

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className='pagination'>
      <Button
        onClick={() => handlePagination("prev")}
        disabled={pageNumber === 1}
        className='!text-small-regular text-light-1'
      >
        Prev
      </Button>
      <p className='text-small-semibold text-light-1'>{pageNumber}</p>
      <Button
        onClick={() => handlePagination("next")}
        disabled={!isNext}
        className='!text-small-regular text-light-1'
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination