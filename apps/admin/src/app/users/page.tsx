import { User, columns } from './columns';
import { DataTable } from './data-table';

const getData = async (): Promise<User[]> => {
  return [
    {
      id: '728ed52a',
      avatar: '/users/1.png',
      status: 'active',
      fullName: 'John Doe',
      email: 'johndoe@gmail.com',
    },
    {
      id: '728ed52b',
      avatar: '/users/2.png',
      status: 'active',
      fullName: 'Jane Smith',
      email: 'janesmith@gmail.com',
    },
    {
      id: '728ed52c',
      avatar: '/users/3.png',
      status: 'inactive',
      fullName: 'Michael Johnson',
      email: 'michaelj@gmail.com',
    },
    {
      id: '728ed52d',
      avatar: '/users/4.png',
      status: 'active',
      fullName: 'Emily Davis',
      email: 'emilydavis@gmail.com',
    },
    {
      id: '728ed52e',
      avatar: '/users/5.png',
      status: 'active',
      fullName: 'David Brown',
      email: 'davidbrown@gmail.com',
    },
    {
      id: '728ed52f',
      avatar: '/users/6.png',
      status: 'inactive',
      fullName: 'Jessica Wilson',
      email: 'jessicaw@gmail.com',
    },
    {
      id: '728ed52g',
      avatar: '/users/7.png',
      status: 'active',
      fullName: 'James Martinez',
      email: 'jamesm@gmail.com',
    },
    {
      id: '728ed52h',
      avatar: '/users/8.png',
      status: 'active',
      fullName: 'Sarah Miller',
      email: 'sarahm@gmail.com',
    },
    {
      id: '728ed52i',
      avatar: '/users/9.png',
      status: 'inactive',
      fullName: 'Robert Taylor',
      email: 'robertt@gmail.com',
    },
    {
      id: '728ed52j',
      avatar: '/users/10.png',
      status: 'active',
      fullName: 'Linda Anderson',
      email: 'lindaa@gmail.com',
    },
    {
      id: '728ed52k',
      avatar: '/users/11.png',
      status: 'active',
      fullName: 'William Thomas',
      email: 'williamt@gmail.com',
    },
    {
      id: '728ed52l',
      avatar: '/users/12.png',
      status: 'inactive',
      fullName: 'Barbara Jackson',
      email: 'barbaraj@gmail.com',
    },
    {
      id: '728ed52m',
      avatar: '/users/13.png',
      status: 'active',
      fullName: 'Richard White',
      email: 'richardw@gmail.com',
    },
    {
      id: '728ed52n',
      avatar: '/users/14.png',
      status: 'active',
      fullName: 'Susan Harris',
      email: 'susanh@gmail.com',
    },
    {
      id: '728ed52o',
      avatar: '/users/15.png',
      status: 'inactive',
      fullName: 'Joseph Martin',
      email: 'josephm@gmail.com',
    },
    {
      id: '728ed52p',
      avatar: '/users/16.png',
      status: 'active',
      fullName: 'Margaret Thompson',
      email: 'margarett@gmail.com',
    },
    {
      id: '728ed52q',
      avatar: '/users/17.png',
      status: 'active',
      fullName: 'Charles Garcia',
      email: 'charlesg@gmail.com',
    },
    {
      id: '728ed52r',
      avatar: '/users/18.png',
      status: 'inactive',
      fullName: 'Christopher Martinez',
      email: 'chrism@gmail.com',
    },
    {
      id: '728ed52s',
      avatar: '/users/19.png',
      status: 'active',
      fullName: 'Daniel Robinson',
      email: 'danielr@gmail.com',
    },
    {
      id: '728ed52t',
      avatar: '/users/20.png',
      status: 'active',
      fullName: 'Patricia Clark',
      email: 'patriciac@gmail.com',
    },
    {
      id: '728ed52u',
      avatar: '/users/21.png',
      status: 'inactive',
      fullName: 'Matthew Rodriguez',
      email: 'matthewr@gmail.com',
    },
    {
      id: '728ed52v',
      avatar: '/users/22.png',
      status: 'active',
      fullName: 'Elizabeth Lewis',
      email: 'elizabethl@gmail.com',
    },
    {
      id: '728ed52w',
      avatar: '/users/23.png',
      status: 'active',
      fullName: 'Anthony Lee',
      email: 'anthonylee@gmail.com',
    },
    {
      id: '728ed52x',
      avatar: '/users/24.png',
      status: 'inactive',
      fullName: 'Jennifer Walker',
      email: 'jenniferw@gmail.com',
    },
    {
      id: '728ed521a',
      avatar: '/users/25.png',
      status: 'active',
      fullName: 'Mark Hall',
      email: 'markhall@gmail.com',
    },
    {
      id: '728ed521b',
      avatar: '/users/26.png',
      status: 'active',
      fullName: 'Paul Allen',
      email: 'paulallen@gmail.com',
    },
    {
      id: '728ed521c',
      avatar: '/users/27.png',
      status: 'inactive',
      fullName: 'Steven Young',
      email: 'stevenyoung@gmail.com',
    },
    {
      id: '728ed521d',
      avatar: '/users/28.png',
      status: 'active',
      fullName: 'Andrew Hernandez',
      email: 'andrewh@gmail.com',
    },
    {
      id: '728ed521e',
      avatar: '/users/29.png',
      status: 'active',
      fullName: 'Brian King',
      email: 'brianking@gmail.com',
    },
    {
      id: '728ed521f',
      avatar: '/users/30.png',
      status: 'inactive',
      fullName: 'Kevin Wright',
      email: 'kevinwright@gmail.com',
    },
    {
      id: '728ed521g',
      avatar: '/users/31.png',
      status: 'active',
      fullName: 'Edward Lopez',
      email: 'edwardlopez@gmail.com',
    },
    {
      id: '728ed521h',
      avatar: '/users/32.png',
      status: 'active',
      fullName: 'Ronald Hill',
      email: 'ronaldhill@gmail.com',
    },
    {
      id: '728ed521i',
      avatar: '/users/33.png',
      status: 'inactive',
      fullName: 'Frances Potter',
      email: 'francespotter@gmail.com',
    },
    {
      id: '728ed52y',
      avatar: '/users/34.png',
      status: 'active',
      fullName: 'Raymond Murray',
      email: 'raymondmurray@gmail.com',
    },
    {
      id: '728ed52z',
      avatar: '/users/35.png',
      status: 'active',
      fullName: 'Adam Sherman',
      email: 'adamsherman@gmail.com',
    },
    {
      id: '728ed521f',
      avatar: '/users/36.png',
      status: 'active',
      fullName: 'Anne Cruz',
      email: 'annecruz@gmail.com',
    },
  ];
};

const UsersPage = async () => {
  const data = await getData();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Users</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default UsersPage;
