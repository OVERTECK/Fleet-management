namespace Backend.API.Abstractions;

public interface IRepository<T>
    where T : IEntity
{
    Task<List<T>> GetAll();

    Task<T> GetById(Guid id);

    Task<T> Create(T entity);

    Task Update(T entity);

    Task Delete(Guid id);
}