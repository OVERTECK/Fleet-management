namespace Backend.DataAccess.Entities;

public class GasStationEntity
{
    public Guid Id { get; set; }

    public CarEntity Car { get; set; }
    
    public string CarId { get; set; }

    public int RefilledLiters { get; set; }

    public Decimal Price { get; set; }
}