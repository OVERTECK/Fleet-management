using Backend.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DataAccess.Repositories;

public class UsersRepository(MyDbContext dbContext)
{
    public async Task<UserEntity?> GetById(Guid id)
    {
        var searchedUser = await dbContext.Users.FirstOrDefaultAsync(c => c.Id == id);

        return searchedUser;
    }

    public async Task<UserEntity?> GetByLogin(string login)
    {
        var searchedUser = await dbContext.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(c => c.Login == login);

        return searchedUser;
    }

    public async Task Create(UserEntity user)
    {
        dbContext.Users.Add(user);

        await dbContext.SaveChangesAsync();
    }
}